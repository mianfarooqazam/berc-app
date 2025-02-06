import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  DataTable,
  Modal,
  Portal,
  Button,
  TextInput,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import AppHeader from '../../components/Header/AppHeader'; // adjust the path as needed
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../../firebase'; // Ensure you export your Firestore instance

export default function AdminEventsScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventName, setEventName] = useState('');
  const [loading, setLoading] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  // Open add event modal
  const openModal = () => {
    setSelectedDate(new Date());
    setEventName('');
    setModalVisible(true);
  };

  // Close add event modal
  const closeModal = () => {
    setModalVisible(false);
  };

  // Fetch events from Firestore ordered by date ascending.
  const fetchEvents = async () => {
    try {
      const eventsRef = collection(db, 'upcoming_events');
      const q = query(eventsRef, orderBy('date', 'asc'));
      const querySnapshot = await getDocs(q);
      const eventsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Add event to Firestore.
  const addEvent = async () => {
    if (!eventName.trim()) return; // Do not add empty event name
    setLoading(true);
    try {
      // Save the event. We store "date" and "eventName".
      await addDoc(collection(db, 'upcoming_events'), {
        date: selectedDate,
        eventName: eventName.trim(),
      });
      // Refresh events list.
      await fetchEvents();
      closeModal();
    } catch (error) {
      console.error('Error adding event:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format the date for display (example: "13 February 2025")
  const formatDate = (date) => {
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleMenuPress = () => {
    navigation.openDrawer();
  };

  const handleNotificationPress = () => {
    console.log('Notifications pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Reusable Header */}
      <AppHeader
        title="Events"
        onMenuPress={handleMenuPress}
        onNotificationPress={handleNotificationPress}
      />

      {/* Button to add event using TouchableRipple */}
      <View style={styles.addButtonContainer}>
        <TouchableRipple
          style={styles.addEventButton}
          onPress={openModal}
          rippleColor="rgba(0, 0, 0, 0.1)"
        >
          <Text style={styles.addEventButtonText}>Add Event</Text>
        </TouchableRipple>
      </View>

      {/* Add Event Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={closeModal}
          contentContainerStyle={styles.modalContainer}
        >
          
          {/* Display selected date */}
         
          {/* Select Date button using TouchableRipple */}
          <TouchableRipple
            style={styles.selectDateButton}
            onPress={() => setDatePickerVisible(true)}
            rippleColor="rgba(0, 0, 0, 0.1)"
          >
            <Text style={styles.selectDateButtonText}>Select Date</Text>
          </TouchableRipple>
          {/* TextInput for the event name */}
          <TextInput
            mode="outlined"
            label="Event Name"
            value={eventName}
            onChangeText={setEventName}
            style={styles.input}
          />
          <View style={styles.modalButtonContainer}>
            {/* Save button implemented with TouchableRipple */}
            <TouchableRipple
              style={styles.saveButton}
              onPress={addEvent}
              rippleColor="rgba(255, 255, 255, 0.3)"
              disabled={loading}
            >
              <View style={styles.saveButtonContent}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </View>
            </TouchableRipple>
            {/* Cancel Button */}
            <Button onPress={closeModal} style={styles.cancelButton}>
              Cancel
            </Button>
          </View>
        </Modal>

        {/* DatePickerModal from react-native-paper-dates */}
        <DatePickerModal
          mode="single"
          visible={datePickerVisible}
          onDismiss={() => setDatePickerVisible(false)}
          date={selectedDate}
          onConfirm={({ date }) => {
            setDatePickerVisible(false);
            setSelectedDate(date);
          }}
        />
      </Portal>

      {/* DataTable to list upcoming events */}
      <View style={styles.dataTableContainer}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title style={styles.serialColumn}>#</DataTable.Title>
            <DataTable.Title>Date</DataTable.Title>
            <DataTable.Title>Event Name</DataTable.Title>
          </DataTable.Header>
          {events.map((event, index) => (
            <DataTable.Row key={event.id}>
              <DataTable.Cell style={styles.serialColumn}>
                {index + 1}
              </DataTable.Cell>
              <DataTable.Cell>{formatDate(event.date)}</DataTable.Cell>
              <DataTable.Cell>{event.eventName}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8ff',
    padding: 20,
  },
  addButtonContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  addEventButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  addEventButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  selectedDateText: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
  },
  selectDateButton: {
    backgroundColor: '#2196f3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 15,
  },
  selectDateButtonText: {
    fontSize: 16,
    color: '#fff', // White text color for Select Date button
  },
  input: {
    marginVertical: 15,
    backgroundColor: "#fff",
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#2196f3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  saveButtonContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginLeft: 10,
  },
  dataTableContainer: {
    marginTop: 30,
  },
  serialColumn: {
    flex: 0.2,
  },
});
