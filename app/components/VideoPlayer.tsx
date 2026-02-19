import { View, StyleSheet, Pressable } from "react-native";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";

export default function VideoPlayer({ source }: { source: string }) {
    const player = useVideoPlayer(source, (player) => {
        player.loop = true;
    });

    const { isPlaying } = useEvent(player, "playingChange", {
        isPlaying: player.playing,
    });

    return (
        <View>
            <Pressable onPress={() => (isPlaying ? player.pause() : player.play())}>
                <VideoView
                    style={styles.video}
                    player={player}
                />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    video: {
        width: 'auto',
        height: 200,
    }
});
