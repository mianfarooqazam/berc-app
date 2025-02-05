import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Title, Paragraph, Searchbar } from 'react-native-paper';
import AppHeader from '../../components/Header/AppHeader'; // adjust the path as needed
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase'; // Ensure you export your Firestore instance

export default function AdminEmpScreen({ navigation }) {
  const [employees, setEmployees] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleMenuPress = () => {
    navigation.openDrawer();
  };

  const handleNotificationPress = () => {
    console.log('Notifications pressed');
  };

  // Fetch employees from Firestore
  const fetchEmployees = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'employees'));
      const empData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmployees(empData);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEmployees();
    setRefreshing(false);
  };

  // Update search query state
  const onChangeSearch = query => {
    setSearchQuery(query);
  };

  // Filter employees based on search query (case-insensitive)
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort employees by employee_id in ascending order
  // (Assumes each document has an "employee_id" field of type number)
  const sortedEmployees = [...filteredEmployees].sort(
    (a, b) => a.employee_id - b.employee_id
  );

  // Render each employee using a Paper Card
  const renderEmployee = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Title style={styles.title}>{item.name}</Title>
        <Paragraph style={styles.paragraph}>{item.designation}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="Employees"
        onMenuPress={handleMenuPress}
        onNotificationPress={handleNotificationPress}
      />
      <Searchbar
        placeholder="Search by name"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchBar}
      />
      {/* Display number of matching names below the search bar */}
      <Text style={styles.countText}>{sortedEmployees.length} Employees</Text>
      <FlatList
        data={sortedEmployees}
        keyExtractor={(item) => item.id}
        renderItem={renderEmployee}
        numColumns={2} // Display 2 cards per row
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper} // Ensure proper alignment in each row
        ListEmptyComponent={
          <Title style={styles.empty}>No employees found.</Title>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8ff',
    padding: 20,
  },
  searchBar: {
    marginBottom: 10,
    backgroundColor: '#fff', 
  },
  countText: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
    color: 'black',
  },
  listContainer: {
    paddingVertical: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  card: {
    width: '45%',
    height: 150,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8ff',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight:'bold'
  },
  paragraph: {
    textAlign: 'center',
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
  },
});
