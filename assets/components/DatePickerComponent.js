import React, { useState, useContext } from 'react';
import { View, TouchableOpacity, Text, Modal, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { DateContext } from '@/Global/DateContext'; 

const DatePickerComponent = () => {
  const { deadline, setDeadline } = useContext(DateContext);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateSelect = (day) => {
    setDeadline(new Date(day.dateString));
    setShowCalendar(false);
  };

  const formattedDate = deadline.toISOString().split('T')[0];

  return (
    <View>
      <TouchableOpacity 
        style={styles.dateInput} 
        onPress={() => setShowCalendar(true)}
      >
        <Text style={styles.dateText}>
          Deadline: {deadline.toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Calendar
              current={formattedDate}
              minDate={new Date().toISOString().split('T')[0]}
              onDayPress={handleDateSelect}
              markedDates={{
                [formattedDate]: {selected: true, selectedColor: '#3b82f6'}
              }}
              theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                textSectionTitleColor: '#6b7280',
                selectedDayBackgroundColor: '#3b82f6',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#3b82f6',
                dayTextColor: '#1f2937',
                textDisabledColor: '#d1d5db',
                arrowColor: '#3b82f6',
                monthTextColor: '#1f2937',
                indicatorColor: '#3b82f6',
              }}
            />
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCalendar(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dateInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    textAlign: 'center',
    backgroundColor: 'white',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    color: '#00177d',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
  },
  closeButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DatePickerComponent;