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
  Snackbar,
  Divider,
} from 'react-native-paper';
import AppHeader from '../../components/Header/AppHeader'; // adjust the path as needed
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Ensure you export your Firestore instance

export default function AdminTaskScreen({ navigation }) {
  const [employees, setEmployees] = useState([]);
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [employeeSuggestions, setEmployeeSuggestions] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  // Priority state (using chips for priority)
  const [priority, setPriority] = useState('');
  const [taskName, setTaskName] = useState('');
  const [comments, setComments] = useState('');

  // Refreshing state for pull-to-refresh
  const [refreshing, setRefreshing] = useState(false);

  // Snackbar state for success or error messages
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

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
  // If employeeSearch exactly matches the selectedEmployee, no suggestions are shown.
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

  // Submit handler writes task data to the "assign_tasks" collection.
  const handleSubmit = async () => {
    try {
      const docRef = await addDoc(collection(db, 'assign_tasks'), {
        employee_name: selectedEmployee,
        priority: priority,
        task_name: taskName,
        comments: comments,
      });
      console.log('Task Submitted with ID:', docRef.id);
      setSnackbarMessage('Task submitted successfully!');
      setSnackbarVisible(true);
      // Optionally, reset the form inputs after successful submission
      setEmployeeSearch('');
      setSelectedEmployee('');
      setEmployeeSuggestions([]);
      setPriority('');
      setTaskName('');
      setComments('');
    } catch (error) {
      console.error('Error submitting task:', error);
      setSnackbarMessage('Error submitting task. Please try again.');
      setSnackbarVisible(true);
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

        {/* Submit Button using TouchableRipple */}
        <TouchableRipple
          onPress={handleSubmit}
          style={styles.button}
          rippleColor="#c8c8c8"
        >
          <Text style={styles.buttonText}>Submit Task</Text>
        </TouchableRipple>
      </ScrollView>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
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
  button: {
    marginTop: 20,
    backgroundColor: '#97d43b',
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
