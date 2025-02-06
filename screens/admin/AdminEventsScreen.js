import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Modal,
  Portal,
  Button,
  TextInput,
  Text,
  TouchableRipple,
  Chip,
} from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import AppHeader from '../../components/Header/AppHeader';
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../../firebase';
import Toast from 'react-native-toast-message';

export default function AdminEventsScreen({ navigation }) {
  // State declarations
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventName, setEventName] = useState('');
  const [loading, setLoading] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  // State for employee list and participants
  const [employees, setEmployees] = useState([]);
  const [participants, setParticipants] = useState([]); // array of employee IDs
  const [participantsInput, setParticipantsInput] = useState('');

  // State for delete confirmation modal
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  // State for pull-to-refresh
  const [refreshing, setRefreshing] = useState(false);

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

  // Fetch employees from Firestore
  const fetchEmployees = async () => {
    try {
      const employeesRef = collection(db, 'employees');
      const querySnapshot = await getDocs(employeesRef);
      const employeesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmployees(employeesData);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // Combined refresh function for pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchEvents(), fetchEmployees()]);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchEvents();
    fetchEmployees();
  }, []);

  // Open add event modal
  const openModal = () => {
    setSelectedDate(new Date());
    setEventName('');
    setParticipants([]);
    setParticipantsInput('');
    setModalVisible(true);
  };

  // Close add event modal
  const closeModal = () => {
    setModalVisible(false);
  };

  // Add a participant if not already added
  const addParticipant = (employeeId) => {
    if (!participants.includes(employeeId)) {
      setParticipants([...participants, employeeId]);
    }
    setParticipantsInput('');
  };

  // Remove participant (when chip is pressed)
  const removeParticipant = (employeeId) => {
    setParticipants(participants.filter((id) => id !== employeeId));
  };

  // Add event to Firestore.
  const addEvent = async () => {
    if (!eventName.trim()) return;
    setLoading(true);
    try {
      // Map selected employee IDs to their names (using the "name" field)
      const selectedEmployeeNames = employees
        .filter((emp) => participants.includes(emp.id))
        .map((emp) => emp.name);

      await addDoc(collection(db, 'upcoming_events'), {
        date: selectedDate,
        eventName: eventName.trim(),
        participants: selectedEmployeeNames,
      });
      await fetchEvents();
      closeModal();
    } catch (error) {
      console.error('Error adding event:', error);
    } finally {
      setLoading(false);
    }
  };

  // Open delete confirmation modal
  const confirmDeleteEvent = (eventId) => {
    setEventToDelete(eventId);
    setDeleteConfirmVisible(true);
  };

  // Delete event from Firestore.
  const deleteEvent = async () => {
    if (!eventToDelete) return;
    try {
      await deleteDoc(doc(db, 'upcoming_events', eventToDelete));
      fetchEvents();
      Toast.show({
        type: 'success',
        text1: 'Event successfully deleted',
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      Toast.show({
        type: 'error',
        text1: 'Error deleting event',
      });
    } finally {
      setDeleteConfirmVisible(false);
      setEventToDelete(null);
    }
  };

  // Format the date for display
  const formatDate = (date) => {
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Filter employees for autocomplete based on participantsInput
  const filteredEmployees = employees.filter((emp) => {
    const inputLower = participantsInput.toLowerCase();
    return (
      emp.name.toLowerCase().includes(inputLower) &&
      !participants.includes(emp.id)
    );
  });

  // Render selected participants as chips
  const renderSelectedParticipants = () => {
    return participants.map((id) => {
      const emp = employees.find((e) => e.id === id);
      if (!emp) return null;
      return (
        <Chip
          key={id}
          onClose={() => removeParticipant(id)}
          style={styles.participantChip}
        >
          {emp.name}
        </Chip>
      );
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <AppHeader
          title="Upcoming Events"
          onMenuPress={() => navigation.openDrawer()}
          onNotificationPress={() => console.log('Notifications pressed')}
        />

        {/* Add Event Button */}
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
            <ScrollView>
              {/* Date selection */}
              <TouchableRipple
                style={styles.selectDateButton}
                onPress={() => setDatePickerVisible(true)}
                rippleColor="rgba(0, 0, 0, 0.1)"
              >
                <Text style={styles.selectDateButtonText}>
                  Select Date: {formatDate(selectedDate)}
                </Text>
              </TouchableRipple>

              {/* Participants selection autocomplete */}
              <TextInput
                mode="outlined"
                label="Participants"
                value={participantsInput}
                onChangeText={setParticipantsInput}
                style={styles.input}
                placeholder="Type name to search"
              />
              {participantsInput.length > 0 && (
                <View style={styles.suggestionsList}>
                  {filteredEmployees.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => addParticipant(item.id)}
                      style={styles.suggestionItem}
                    >
                      <Text style={styles.suggestionText}>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Display selected participants as chips */}
              <View style={styles.chipsContainer}>
                {renderSelectedParticipants()}
              </View>

              {/* Event Name input */}
              <TextInput
                mode="outlined"
                label="Event Name"
                value={eventName}
                onChangeText={setEventName}
                style={styles.input}
              />

              {/* Buttons */}
              <View style={styles.modalButtonContainer}>
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
                <Button onPress={closeModal} style={styles.cancelButton}>
                  Cancel
                </Button>
              </View>
            </ScrollView>
          </Modal>

          {/* DatePicker Modal */}
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

          {/* Delete Confirmation Modal */}
          <Modal
            visible={deleteConfirmVisible}
            onDismiss={() => setDeleteConfirmVisible(false)}
            contentContainerStyle={styles.deleteModalContainer}
          >
            <Text style={styles.deleteModalText}>
              Are you sure you want to delete this event?
            </Text>
            <View style={styles.deleteModalButtons}>
              <Button mode="contained" onPress={deleteEvent}>
                Yes
              </Button>
              <Button
                mode="outlined"
                onPress={() => setDeleteConfirmVisible(false)}
              >
                Cancel
              </Button>
            </View>
          </Modal>
        </Portal>

        {/* Events Cards with Pull to Refresh */}
        <ScrollView
          contentContainerStyle={styles.cardsContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {events.map((event, index) => (
            <View key={event.id} style={styles.card}>
              {/* Top-right container for serial number and delete button */}
              <View style={styles.topRightContainer}>
                <Text style={styles.serialNumber}>#{index + 1}</Text>
                <Button
                  mode="contained"
                  onPress={() => confirmDeleteEvent(event.id)}
                  style={styles.deleteButton}
                  labelStyle={{ fontSize: 12 }}
                >
                  Delete
                </Button>
              </View>
              <Text style={styles.cardDate}>{formatDate(event.date)}</Text>
              <Text style={styles.cardTitle}>{event.eventName}</Text>
              <View style={styles.cardParticipants}>
                {event.participants &&
                  event.participants.map((participant, idx) => (
                    <Text key={idx} style={styles.cardParticipantText}>
                      {participant}
                    </Text>
                  ))}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Toast Container */}
        <Toast />
      </SafeAreaView>
    </KeyboardAvoidingView>
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
  selectDateButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 15,
  },
  selectDateButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  input: {
    marginVertical: 15,
    backgroundColor: '#fff',
  },
  suggestionsList: {
    backgroundColor: '#eee',
    maxHeight: 150,
    borderRadius: 5,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  suggestionText: {
    fontSize: 16,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  participantChip: {
    marginRight: 5,
    marginBottom: 5,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#2196F3',
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
  // Cards Container
  cardsContainer: {
    paddingVertical: 20,
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 15,
    padding: 15,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    position: 'relative',
  },
  topRightContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    alignItems: 'center',
  },
  serialNumber: {
    backgroundColor: '#2196F3',
    color: '#fff',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 4,
  },
  deleteButton: {
    marginTop: 4,
    backgroundColor: 'red', // Red background for delete button
  },
  cardDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardParticipants: {
    flexDirection: 'column',
  },
  cardParticipantText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  // Delete confirmation modal styles
  deleteModalContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 8,
  },
  deleteModalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  deleteModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
