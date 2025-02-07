import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, ScrollView, View, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text, Chip, Portal, Dialog, Button } from 'react-native-paper';
import AppHeader from '../../components/Header/AppHeader'; // Adjust the path as needed
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../../firebase';

// Helper to return a color based on the priority value
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Urgent':
      return '#ff1744';
    case 'High':
      return '#ff9100';
    case 'Medium':
      return '#ffee58';
    case 'Low':
      return '#00e676';
    default:
      return '#e0e0e0';
  }
};

// Format the deadline date as "Weekday day, Month"
const formatDeadline = (date) => {
  if (!date) return '';
  const d = date.toDate ? date.toDate() : new Date(date);
  return `${d.toLocaleDateString('en-US', { weekday: 'long' })} ${d.getDate()}, ${d.toLocaleDateString('en-US', { month: 'long' })}`;
};

export default function EmpAssignedTasksScreen({ navigation }) {
  const [employeeName, setEmployeeName] = useState('');
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [visible, setVisible] = useState(false);
  const currentUser = auth.currentUser;

  // Fetch the employee's name from the "employees" collection using the current user's email.
  useEffect(() => {
    async function fetchEmployeeName() {
      if (currentUser && currentUser.email) {
        try {
          const empQuery = query(
            collection(db, 'employees'),
            where('employee_email', '==', currentUser.email)
          );
          const querySnapshot = await getDocs(empQuery);
          if (!querySnapshot.empty) {
            const empData = querySnapshot.docs[0].data();
            setEmployeeName(empData.name);
          } else {
            setEmployeeName(currentUser.email.split('@')[0]);
          }
        } catch (error) {
          console.error('Error fetching employee name:', error);
          setEmployeeName(currentUser.email.split('@')[0]);
        }
      }
    }
    fetchEmployeeName();
  }, [currentUser]);

  // Fetch tasks assigned to this employee.
  const fetchTasks = async () => {
    if (!employeeName) return;
    try {
      const tasksQuery = query(
        collection(db, 'assign_tasks'),
        where('employee_name', '==', employeeName)
      );
      const querySnapshot = await getDocs(tasksQuery);
      const tasksData = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .reverse(); // Reverse to show the latest tasks on top.
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching tasks for employee:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [employeeName]);

  // Pull-to-refresh handler.
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  }, [employeeName]);

  // When a card is pressed, store the selected task and display the modal.
  const handleCardPress = (task) => {
    setSelectedTask(task);
    setVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="My Tasks"
        onMenuPress={() => navigation.toggleDrawer()}
        onNotificationPress={() => console.log('Notification pressed')}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {tasks.length === 0 ? (
          <Text style={styles.noTasksText}>No tasks assigned to you.</Text>
        ) : (
          tasks.map((task, index) => (
            <Card
              key={task.id}
              style={styles.card}
              onPress={() => handleCardPress(task)}
            >
              {/* Task number in top right */}
              <View style={styles.cardHeader}>
                <Text style={styles.taskNumber}>#{index + 1}</Text>
              </View>
              <Card.Content>
                {/* Assigned By */}
                <View style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>Assigned By: </Text>
                  <Text style={styles.fieldValue}>{task.assigned_by || 'Unknown'}</Text>
                </View>
                {/* Priority */}
                <View style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>Priority: </Text>
                  <Chip
                    style={[styles.priorityChip, { backgroundColor: getPriorityColor(task.priority) }]}
                    textStyle={styles.priorityChipText}
                  >
                    {task.priority}
                  </Chip>
                </View>
                {/* Task Name */}
                <View style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>Task: </Text>
                  <Text style={styles.fieldValue}>{task.task_name}</Text>
                </View>
                {/* Deadline */}
                <View style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>Deadline: </Text>
                  <Text style={styles.fieldValue}>{formatDeadline(task.deadline)}</Text>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Modal to display Task Comments */}
      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>Task Details</Dialog.Title>
          <Dialog.Content>
            <Text>
              Task Name: <Text style={{ fontWeight: 'bold' }}>{selectedTask?.task_name}</Text>
            </Text>
            <Text style={{ marginTop: 10 }}>
              Comments: {selectedTask?.comments || 'No comments available.'}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
    paddingBottom: 20,
    alignItems: 'center', // Center cards horizontally
  },
  noTasksText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    width: '90%',
    marginBottom: 15,
    elevation: 3,
    position: 'relative',
    paddingTop: 20,
    backgroundColor: '#f8f8ff',
  },
  cardHeader: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  taskNumber: {
    backgroundColor: '#2196F3',
    color: '#fff',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontWeight: 'bold',
    fontSize: 12,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    flexWrap: 'wrap',
  },
  fieldLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  fieldValue: {
    fontSize: 16,
    color: '#333',
    flexShrink: 1,
  },
  priorityChip: {
    marginLeft: 4,
  },
  priorityChipText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
