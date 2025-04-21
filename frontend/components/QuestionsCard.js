import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
const Colors = '@/constants/Colors';

export default function QuestionCard({ question, onAnswer, selectedAnswer, isCorrect }) {
  const [options, setOptions] = useState([]);
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    const allOptions = [
      question.correct_answer,
      question.wrong_answer1,
      question.wrong_answer2,
      question.wrong_answer3,
    ];

    const shuffled = allOptions.sort(() => Math.random() - 0.5);
    setOptions(shuffled);

    animation.setValue(0);
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [question]);

  const getOptionStyle = (option) => {
    if (!selectedAnswer) return styles.option;

    if (option === question.correct_answer) return [styles.option, styles.correctOption];
    if (option === selectedAnswer) return [styles.option, styles.incorrectOption];

    return [styles.option, styles.disabledOption];
  };

  const getOptionTextStyle = (option) => {
    if (!selectedAnswer) return styles.optionText;

    if (option === question.correct_answer) return [styles.optionText, styles.correctOptionText];
    if (option === selectedAnswer) return [styles.optionText, styles.incorrectOptionText];

    return [styles.optionText, styles.disabledOptionText];
  };

  const animatedStyle = {
    opacity: animation,
    transform: [{
      translateY: animation.interpolate({
        inputRange: [0, 1],
        outputRange: [30, 0],
      }),
    }],
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.question}</Text>

        {question.doctor_name && (
          <View style={styles.metadataContainer}>
            <Text style={styles.metadataText}>Doctor: {question.doctor_name}</Text>
            {question.episode_title && (
              <Text style={styles.metadataText}>Episode: {question.episode_title}</Text>
            )}
          </View>
        )}
      </View>

      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={getOptionStyle(option)}
            onPress={() => !selectedAnswer && onAnswer(option)}
            disabled={!!selectedAnswer}
          >
            <Text style={getOptionTextStyle(option)}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedAnswer && (
        <View style={styles.feedbackContainer}>
          <Text style={isCorrect ? styles.correctFeedback : styles.incorrectFeedback}>
            {isCorrect
              ? "Correct! Fantastic!"
              : `Oops! Correct answer: "${question.correct_answer}"`}
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    lineHeight: 28,
  },
  metadataContainer: {
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: Colors.backgroundSecondary,
  },
  metadataText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  optionsContainer: {
    marginTop: 16,
  },
  option: {
    backgroundColor: Colors.backgroundSecondary,
    padding: 14,
    borderRadius: 12,
    marginVertical: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionText: {
    fontSize: 16,
    color: Colors.text,
  },
  correctOption: {
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
    borderColor: Colors.success,
  },
  incorrectOption: {
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    borderColor: Colors.error,
  },
  disabledOption: {
    opacity: 0.6,
  },
  correctOptionText: {
    color: Colors.success,
    fontWeight: 'bold',
  },
  incorrectOptionText: {
    color: Colors.error,
    fontWeight: 'bold',
  },
  disabledOptionText: {
    color: Colors.textSecondary,
  },
  feedbackContainer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  correctFeedback: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.success,
    textAlign: 'center',
  },
  incorrectFeedback: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.error,
    textAlign: 'center',
  },
});
