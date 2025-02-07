import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  TextInput,
  TouchableRipple,
  Title,
  Chip,
  Text,
  Card,
} from 'react-native-paper';
import {
  DatePickerModal,
  registerTranslation,
} from 'react-native-paper-dates';
import Toast from 'react-native-toast-message';
import AppHeader from '../../components/Header/AppHeader'; // adjust the path as needed
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db, auth } from '../../firebase'; // Ensure you export your Firestore instance and auth

// Register a complete English translation for react-native-paper-dates.
registerTranslation('en', {
  save: 'Save',
  cancel: 'Cancel',
  close: 'Close',            // Added missing key.
  typeInDate: 'Type in date', // Added missing key.
  selectSingle: 'Select date',
  selectMultiple: 'Select dates',
  selectRange: 'Select date range',
  notAccordingToPlan: 'Not available',
  previous: 'Previous',
  next: 'Next',
});

export default function AdminTaskScreen({ navigation }) {
  // Get the currently logged in user from auth.
  const currentUser = auth.currentUser;
  // State to hold the admin's name from the employees collection.
  const [assignedBy, setAssignedBy] = useState('');

  // Fetch the currently logged-in user's name from the employees collection.
  useEffect(() => {
    async function fetchAssignedBy() {
      if (currentUser && currentUser.email) {
        try {
          const q = query(
            collection(db, 'employees'),
            where('employee_email', '==', currentUser.email)
          );
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const adminData = querySnapshot.docs[0].data();
            setAssignedBy(adminData.name);
          } else {
            // Fallback: use the username from the email
            setAssignedBy(currentUser.email.split('@')[0]);
          }
        } catch (error) {
          console.error('Error fetching assignedBy from employees:', error);
          setAssignedBy(currentUser.email.split('@')[0]);
        }
      }
    }
    fetchAssignedBy();
  }, [currentUser]);

  const [employees, setEmployees] = useState([]);
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [employeeSuggestions, setEmployeeSuggestions] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  // Priority state (using chips for priority)
  const [priority, setPriority] = useState('');
  const [taskName, setTaskName] = useState('');
  const [comments, setComments] = useState('');

  // Deadline state using react-native-paper-dates modal
  const [deadline, setDeadline] = useState(null);
  const [calendarVisible, setCalendarVisible] = useState(false);

  // Refreshing state for pull-to-refresh
  const [refreshing, setRefreshing] = useState(false);

  const handleMenuPress = () => {
    navigation.openDrawer();
  };

  const handleNotificationPress = () => {
    console.log('Notifications pressed');
  };

  // Fetch employee names from Firestore
  const fetchEmployees = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'employees'));
      const empData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmployees(empData);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Update suggestions as the user types.
  useEffect(() => {
    if (employeeSearch.length > 0 && employeeSearch !== selectedEmployee) {
      const suggestions = employees.filter((employee) =>
        employee.name.toLowerCase().includes(employeeSearch.toLowerCase())
      );
      setEmployeeSuggestions(suggestions);
    } else {
      setEmployeeSuggestions([]);
    }
  }, [employeeSearch, employees, selectedEmployee]);

  // When a suggestion is tapped
  const onSelectEmployee = (employee) => {
    setSelectedEmployee(employee.name);
    setEmployeeSearch(employee.name);
    setEmployeeSuggestions([]);
  };

  // Priority options with colors
  const priorityOptions = [
    { label: 'Urgent', value: 'Urgent', color: '#ff1744' },
    { label: 'High', value: 'High', color: '#ff9100' },
    { label: 'Medium', value: 'Medium', color: '#ffee58' },
    { label: 'Low', value: 'Low', color: '#00e676' },
  ];

  // Calendar modal functions using react-native-paper-dates
  const showCalendar = () => setCalendarVisible(true);
  const hideCalendar = () => setCalendarVisible(false);
  const handleConfirmDate = ({ date }) => {
    setDeadline(date);
    hideCalendar();
  };

  // Format the selected deadline as "Weekday day, Month"
  // Example: "Saturday 21, January"
  const formattedDeadline = deadline
    ? `${deadline.toLocaleDateString('en-US', { weekday: 'long' })} ${deadline.getDate()}, ${deadline.toLocaleDateString('en-US', {
        month: 'long',
      })}`
    : '';

  // Prepare today's date with the time reset to midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Submit handler writes task data to the "assign_tasks" collection.
  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, 'assign_tasks'), {
        employee_name: selectedEmployee,
        priority: priority,
        task_name: taskName,
        comments: comments,
        // Save the deadline as a Date object (Firestore will convert it to a timestamp)
        deadline: deadline,
        assigned_by: assignedBy, // Save the assigner (name from employees collection)
      });
      console.log('Task submitted successfully!');
      Toast.show({
        type: 'success',
        text1: 'Task submitted successfully!',
      });
      // Optionally, reset the form inputs after successful submission
      setEmployeeSearch('');
      setSelectedEmployee('');
      setEmployeeSuggestions([]);
      setPriority('');
      setTaskName('');
      setComments('');
      setDeadline(null);
    } catch (error) {
      console.error('Error submitting task:', error);
      Toast.show({
        type: 'error',
        text1: 'Error submitting task. Please try again.',
      });
    }
  };

  // When user performs pull-to-refresh, reset all form inputs and re-fetch employees
  const handleRefresh = async () => {
    setRefreshing(true);
    // Reset form inputs
    setEmployeeSearch('');
    setSelectedEmployee('');
    setEmployeeSuggestions([]);
    setPriority('');
    setTaskName('');
    setComments('');
    setDeadline(null);
    // Re-fetch employee data
    await fetchEmployees();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="Assign Task"
        onMenuPress={handleMenuPress}
        onNotificationPress={handleNotificationPress}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Display the logged in user's name in a Card */}
        <Card style={styles.assignedByCard}>
          <Card.Content>
            <Text style={styles.assignedByText}>
              Assigned by: {assignedBy}
            </Text>
          </Card.Content>
        </Card>

        {/* Employee Auto-Suggest Container */}
        <View style={styles.autoSuggestContainer}>
          <TextInput
            label="Employee Name"
            value={employeeSearch}
            onChangeText={(text) => {
              setEmployeeSearch(text);
              setSelectedEmployee(''); // Clear selection when editing
            }}
            mode="outlined"
            style={styles.input}
          />
          {employeeSuggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {employeeSuggestions.map((employee) => (
                <TouchableOpacity
                  key={employee.id}
                  onPress={() => onSelectEmployee(employee)}
                  style={styles.suggestionItem}
                >
                  <Title style={styles.suggestionText}>{employee.name}</Title>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Priority Chips */}
        <View style={styles.chipsContainer}>
          {priorityOptions.map((option) => (
            <Chip
              key={option.value}
              onPress={() => setPriority(option.value)}
              style={[
                styles.chip,
                {
                  backgroundColor:
                    priority === option.value ? option.color : '#e0e0e0',
                },
              ]}
              textStyle={
                priority === option.value
                  ? styles.chipTextSelected
                  : styles.chipText
              }
            >
              {option.label}
            </Chip>
          ))}
        </View>

        {/* Task Name Input */}
        <TextInput
          label="Task Name"
          value={taskName}
          onChangeText={setTaskName}
          mode="outlined"
          style={styles.input}
        />

        {/* Comments Input */}
        <TextInput
          label="Comments"
          value={comments}
          onChangeText={setComments}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
        />

        {/* Deadline Selection Button */}
        <TouchableRipple
          onPress={showCalendar}
          style={[
            styles.deadlineButton,
            deadline && styles.deadlineButtonSelected,
          ]}
          rippleColor="#c8c8c8"
        >
          <Text style={styles.deadlineButtonText}>
            {deadline ? formattedDeadline : 'Select Deadline'}
          </Text>
        </TouchableRipple>

        {/* Date Picker Modal from react-native-paper-dates */}
        <DatePickerModal
          mode="single"
          visible={calendarVisible}
          onDismiss={hideCalendar}
          date={deadline || new Date()}
          onConfirm={handleConfirmDate}
          label="Deadline"
          locale="en"
          // Disable dates before today (allowing today's date)
          validRange={{ startDate: today }}
        />

        {/* Submit Button using TouchableRipple */}
        <TouchableRipple
          onPress={handleSubmit}
          style={styles.submitButton}
          rippleColor="#c8c8c8"
        >
          <Text style={styles.submitButtonText}>Submit Task</Text>
        </TouchableRipple>
      </ScrollView>
      {/* Remove Snackbar and use Toast instead */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8ff',
    padding: 20,
  },
  content: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  assignedByCard: {
    backgroundColor: '#f8f8ff',
    marginBottom: 20,
    elevation: 2,
    borderRadius: 8,
  },
  assignedByText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  autoSuggestContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#f8f8ff',
    marginBottom: 20,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    zIndex: 10,
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 16,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    color: '#000',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deadlineButton: {
    backgroundColor: '#2196f3',
    borderRadius: 4,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  deadlineButtonSelected: {
    backgroundColor: 'red',
  },
  deadlineButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#97d43b',
    borderRadius: 4,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
