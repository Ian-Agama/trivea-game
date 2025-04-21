import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import axios from 'axios';
//import QuestionCard from '../components/QuestionCard';
//import QuestionCard from './components/QuestionCard';

export default function GameScreen() {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/api/question');
      setQuestion(response.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => { fetchQuestion(); }, []);

  const handleAnswer = (selectedIndex) => {
    if (selectedIndex === question.correctIndex) {
      setScore(score + 1);
    }
    setRound(round + 1);
    fetchQuestion();
  };

  

  return (
    <View style={styles.container}>
      <Text style={styles.round}>Round: {round}</Text>
      <Text style={styles.score}>Score: {score}</Text>
      <QuestionCard question={question} onSelect={handleAnswer} />
      <Button title="Next" onPress={fetchQuestion} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  round: { fontSize: 18, marginBottom: 10 },
  score: { fontSize: 18, marginBottom: 20 }
});
