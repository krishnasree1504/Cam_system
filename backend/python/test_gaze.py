import cv2

from gaze_estimator import GazeEstimator


VIDEO_PATH = "test_video.mp4"

gaze = GazeEstimator()

cap = cv2.VideoCapture(VIDEO_PATH)

if not cap.isOpened():
    raise RuntimeError(
        f"Could not open video: {VIDEO_PATH}"
    )

frame_count = 0

while True:

    success, frame = cap.read()

    if not success:
        break

    frame_count += 1

    # Test every 10th frame
    if frame_count % 10 != 0:
        continue

    result = gaze.estimate(frame)

    print(
        f"Frame={frame_count} "
        f"Gaze={result['direction']} "
        f"Confidence={result['confidence']} "
        f"Yaw={result['yaw']} "
        f"Pitch={result['pitch']}"
    )

cap.release()
gaze.close()

print()
print("Gaze test completed.")
