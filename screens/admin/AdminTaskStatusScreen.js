import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, ScrollView, View, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text, Chip, TouchableRipple } from 'react-native-paper';
import AppHeader from '../../components/Header/AppHeader'; // adjust the path as needed
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase'; // Ensure you export your Firestore instance

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

export default function AdminTaskStatusScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('All'); // 'All' | 'Completed' | 'Pending'

  const handleMenuPress = () => {
    navigation.openDrawer();
  };

  const handleNotificationPress = () => {
    console.log('Notifications pressed');
  };

  // Fetch tasks from Firestore and assign a random status for demo purposes.
  // Also reverse the array so that the last task added appears on top.
  const fetchTasks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'assign_tasks'));
      const tasksData = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Assign a random status only once for consistency
          status: Math.random() < 0.5 ? 'Completed' : 'Pending',
        }))
        .reverse(); // Reverse the list so that the last added task is on top
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  }, []);

  // Format the deadline date as "Weekday day, Month"
  // Example: "Saturday 21, January"
  const formatDeadline = (date) => {
    if (!date) return '';
    // Convert Firestore Timestamp to Date if needed.
    const d = date.toDate ? date.toDate() : new Date(date);
    return `${d.toLocaleDateString('en-US', { weekday: 'long' })} ${d.getDate()}, ${d.toLocaleDateString('en-US', { month: 'long' })}`;
  };

  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'All') return true;
    return task.status === filter;
  });

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="Tasks Status"
        onMenuPress={handleMenuPress}
        onNotificationPress={handleNotificationPress}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          <TouchableRipple
            style={[
              styles.filterButton,
              { backgroundColor: filter === 'All' ? '#2196F3' : '#ddd' },
            ]}
            onPress={() => setFilter('All')}
            rippleColor="rgba(255, 255, 255, 0.3)"
          >
            <Text style={styles.filterButtonText}>All</Text>
          </TouchableRipple>
          <TouchableRipple
            style={[
              styles.filterButton,
              { backgroundColor: filter === 'Completed' ? '#97d43b' : '#ddd' },
            ]}
            onPress={() => setFilter('Completed')}
            rippleColor="rgba(255, 255, 255, 0.3)"
          >
            <Text style={styles.filterButtonText}>Completed</Text>
          </TouchableRipple>
          <TouchableRipple
            style={[
              styles.filterButton,
              { backgroundColor: filter === 'Pending' ? '#ff9100' : '#ddd' },
            ]}
            onPress={() => setFilter('Pending')}
            rippleColor="rgba(255, 255, 255, 0.3)"
          >
            <Text style={styles.filterButtonText}>Pending</Text>
          </TouchableRipple>
        </View>

        {/* Task Cards */}
        {filteredTasks.map((task, index) => (
          <Card key={task.id} style={styles.card}>
            {/* Task number in top right */}
            <View style={styles.cardHeader}>
              <Text style={styles.taskNumber}>#{index + 1}</Text>
            </View>
            <Card.Content>
              {/* Assigned To */}
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Assigned To: </Text>
                <Text style={styles.fieldValue}>{task.employee_name}</Text>
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
              {/* Status */}
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Status: </Text>
                <Chip
                  style={[
                    styles.statusChip,
                    task.status === 'Completed' ? styles.completedChip : styles.pendingChip,
                  ]}
                  textStyle={styles.statusChipText}
                >
                  {task.status}
                </Chip>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
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
    alignItems: 'center', // center cards horizontally
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 15,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff', // White text for all buttons
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
  // Updated taskNumber style for a blue background (same as AdminEventsScreen)
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
  statusChip: {
    marginLeft: 4,
  },
  completedChip: {
    backgroundColor: '#97d43b',
  },
  pendingChip: {
    backgroundColor: '#ff9100',
  },
  statusChipText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
