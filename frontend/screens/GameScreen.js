import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function GameScreen() {
  const [questions, setQuestions] = useState([]); // Holds the list of trivia questions
  const [currentIndex, setCurrentIndex] = useState(0); // Tracks the current question
  const [score, setScore] = useState(0); // Tracks the user's score
  const [loading, setLoading] = useState(true); // Tracks loading state
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Tracks the selected answer

  // Fetch trivia questions from the backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/questions'); // Replace with your local IP address
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
      setLoading(false);
    };

    fetchQuestions();
  }, []);

  // Handle the user's answer selection
  const handleAnswer = (answer) => {
    const currentQuestion = questions[currentIndex];
    const isCorrect = answer === currentQuestion.correct_answer;

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    setSelectedAnswer(answer);

    // Move to the next question after a delay
    setTimeout(() => {
      setSelectedAnswer(null);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, 1500);
  };

  // Show a loading spinner if the questions are still being fetched
  if (loading) {
    return <ActivityIndicator size="large" style={styles.loading} />;
  }

  // Game-over screen
  if (currentIndex >= questions.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.finalText}>Game Over! 🎉</Text>
        <Text style={styles.scoreText}>
          Your Score: {score} / {questions.length}
        </Text>
        <Button
          title="Play Again"
          onPress={() => {
            setCurrentIndex(0);
            setScore(0);
          }}
        />
      </View>
    );
  }

  // Render the current question and options
  const currentQuestion = questions[currentIndex];
  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{currentQuestion.question}</Text>
      {currentQuestion.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionButton,
            selectedAnswer === option && {
              backgroundColor: option === currentQuestion.correct_answer ? 'green' : 'red',
            },
          ]}
          onPress={() => handleAnswer(option)}
          disabled={selectedAnswer !== null}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
      <Text style={styles.scoreText}>Score: {score}</Text>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#d9d9d9',
    padding: 10,
    marginVertical: 5,
    width: '80%',
    borderRadius: 5,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
  },
  scoreText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  finalText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
