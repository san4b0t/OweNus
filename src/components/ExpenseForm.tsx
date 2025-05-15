import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Chip, TextInput } from 'react-native-paper';

interface ExpenseFormProps {
  onSubmit: (expense: { title: string; amount: string; members: string[] }) => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [member, setMember] = useState('');
  const [members, setMembers] = useState<string[]>([]);

  const handleAddMember = () => {
    if (member && !members.includes(member)) {
      setMembers([...members, member]);
      setMember('');
    }
  };

  const handleSubmit = () => {
    onSubmit({ title, amount, members });
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Expense Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        label="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />
      <View style={styles.memberContainer}>
        <TextInput
          label="Add Member"
          value={member}
          onChangeText={setMember}
          style={styles.memberInput}
          right={
            <TextInput.Icon 
              icon="plus" 
              onPress={handleAddMember} 
              disabled={!member}
            />
          }
        />
        <View style={styles.chipContainer}>
          {members.map((name, index) => (
            <Chip
              key={index}
              style={styles.chip}
              onClose={() => setMembers(members.filter(m => m !== name))}
            >
              {name}
            </Chip>
          ))}
        </View>
      </View>
      <Button mode="contained" onPress={handleSubmit} style={styles.button}>
        Save Expense
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  input: { marginBottom: 16 },
  memberContainer: { marginBottom: 16 },
  memberInput: { marginBottom: 8 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { margin: 4 },
  button: { marginTop: 8 }
});