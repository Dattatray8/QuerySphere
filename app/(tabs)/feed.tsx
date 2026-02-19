import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import useQuestions from '@/hooks/useQuetions';
import { useDispatch, useSelector } from 'react-redux';
import EmptyQuestionMessage from '../components/question/EmptyQuestionMessage';
import Question from '../components/question/Question';
import { setPage } from '@/redux/questionSlice';
import Button from '../components/ui/Button';

const Feed = () => {
  const { loading, hasMore, message } = useQuestions();
  const { questions, page } = useSelector((state: any) => state.question);
  const dispatch = useDispatch();
  console.log(message)
  return (
    <ScrollView>
      {loading ? (
        <View style={{ paddingTop: 300 }}>
          <ActivityIndicator size={30} />
        </View>
      ) : questions.length === 0 ? (
        <EmptyQuestionMessage />
      ) : (
        <View style={styles.queContainer}>
          {questions.map((q: object, idx: number) => (
            <Question key={idx} q={q} />
          ))}
        </View>
      )}
      {hasMore && !loading && (
        <Button text={'Load More'} onClick={() => dispatch(setPage(page + 1))} style={{ padding: 12, alignSelf: 'center', marginBottom: 20 }} />
      )}
      {message && !hasMore && (
        <Text style={{ textAlign: 'center', marginVertical: 20, color: 'gray' }}>{message}</Text>
      )}
    </ScrollView>
  )
}

export default Feed

const styles = StyleSheet.create({
  queContainer: {
    marginVertical: 20,
    flexDirection: 'column',
    gap: 20,
  }
})