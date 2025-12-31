import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import useQuestions from '@/hooks/useQuetions';
import { useDispatch, useSelector } from 'react-redux';
import EmptyQuestionMessage from '../components/question/EmptyQuestionMessage';
import Question from '../components/question/Question';
import { setPage } from '@/redux/questionSlice';
import Button from '../components/ui/Button';

const feed = () => {
  const { loading, hasMore, message } = useQuestions();
  const { questions, page } = useSelector((state) => state.question);
  const dispatch = useDispatch();
  console.log(message)
  return (
    <ScrollView>
      {loading ? (
        <View>
          <ActivityIndicator />
        </View>
      ) : questions.length === 0 ? (
        <EmptyQuestionMessage />
      ) : (
        <View>
          {questions.map((q, idx) => (
            <Question key={idx} />
          ))}
        </View>
      )}
      {hasMore && !loading && (
        <Button text={'Load More'} onClick={() => dispatch(setPage(page + 1))} style={{ padding: 12, alignSelf: 'center' }} />
      )}
      {message && !hasMore && (
        <Text style={{ textAlign: 'center', marginVertical: 20, color: 'gray' }}>{message}</Text>
      )}
    </ScrollView>
  )
}

export default feed

const styles = StyleSheet.create({})