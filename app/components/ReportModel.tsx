import React, { useState } from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSendReport } from '@/hooks/useSendReport';

interface ReportModalProps {
    visible: boolean;
    onClose: () => void;
    reportedUserId: string;
    contentId?: string;
    contentType: string
}

const ReportModal = ({ visible, onClose, reportedUserId, contentId, contentType }: ReportModalProps) => {
    const [reason, setReason] = useState('');
    const { sendReport, loading } = useSendReport();

    const handleSend = async () => {
        if (!reason.trim()) {
            return alert("Please provide a reason for reporting.");
        }

        await sendReport(reason, reportedUserId, contentId, contentType);

        setReason('');
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.container}
                >
                    <Pressable style={styles.modalBox} onPress={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.title}>Send Report</Text>
                            <TouchableOpacity onPress={onClose}>
                                <Ionicons name="close" size={24} color="#6b7280" />
                            </TouchableOpacity>
                        </View>

                        {/* Input */}
                        <Text style={styles.label}>Reason for reporting</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Explain why you are reporting this..."
                            multiline
                            numberOfLines={4}
                            value={reason}
                            onChangeText={setReason}
                            textAlignVertical="top"
                        />

                        {/* Submit Button */}
                        <TouchableOpacity
                            style={[styles.submitBtn, !reason.trim() && styles.disabledBtn]}
                            onPress={handleSend}
                            disabled={loading || !reason.trim()}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.submitText}>Submit Report</Text>
                            )}
                        </TouchableOpacity>
                    </Pressable>
                </KeyboardAvoidingView>
            </Pressable>
        </Modal>
    );
};

export default ReportModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end', // Slides up from bottom like a sheet
    },
    container: {
        width: '100%',
    },
    modalBox: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    label: {
        fontSize: 14,
        color: '#4b5563',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 10,
        padding: 12,
        height: 120,
        fontSize: 15,
        backgroundColor: '#f9fafb',
    },
    submitBtn: {
        backgroundColor: '#ef4444', // Red for report
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    disabledBtn: {
        backgroundColor: '#fca5a5',
    },
    submitText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});