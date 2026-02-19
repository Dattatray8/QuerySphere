import React from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';

interface BannedMessageProps {
    visible: boolean;
    onClose: () => void;
}

const BannedMessage = ({ visible, onClose }: BannedMessageProps) => {
    const router = useRouter();
    const { userData } = useSelector((state: any) => state.user); 

    const handleVisitProfile = () => {
        onClose();
        router.push(`/(tabs)/profile/${userData?._id}`);
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalBox}>
                    <Text style={styles.title}>Account Restricted</Text>

                    <Text style={styles.message}>
                        Your account is currently banned.{" "}
                        <Text
                            style={styles.underline}
                            onPress={handleVisitProfile}
                        >
                            Visit your profile
                        </Text>{" "}
                        to see the ban duration.
                    </Text>

                    <View style={styles.modalAction}>
                        <TouchableOpacity style={styles.btn} onPress={onClose}>
                            <Text style={styles.btnText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default BannedMessage;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalBox: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#ef4444', 
    },
    message: {
        fontSize: 16,
        lineHeight: 24,
        color: '#374151',
    },
    underline: {
        textDecorationLine: 'underline',
        fontWeight: '600',
        color: '#2563eb',
    },
    modalAction: {
        marginTop: 24,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    btn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#f3f4f6',
    },
    btnText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
});