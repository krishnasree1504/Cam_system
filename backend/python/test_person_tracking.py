import cv2
from pathlib import Path
from ultralytics import YOLO

MODEL_PATH = Path("models/yolov8n.pt")
VIDEO_PATH = Path("test_video.mp4")

model = YOLO(str(MODEL_PATH))

print("MODEL:", MODEL_PATH.resolve())
print("CLASSES:", model.names)

cap = cv2.VideoCapture(str(VIDEO_PATH))

if not cap.isOpened():
    raise RuntimeError("Could not open video")

unique_people = set()
frame_count = 0
max_people = 0

while True:

    success, frame = cap.read()

    if not success:
        break

    frame_count += 1

    results = model.track(
        frame,
        persist=True,
        tracker="bytetrack.yaml",
        classes=[0],
        conf=0.30,
        iou=0.50,
        verbose=False
    )

    result = results[0]

    current_people = 0

    if result.boxes is not None and result.boxes.id is not None:

        ids = result.boxes.id.int().cpu().tolist()

        unique_people.update(ids)

        current_people = len(ids)

    max_people = max(max_people, current_people)

    if frame_count % 30 == 0:

        print(
            f"Frame={frame_count} "
            f"Current={current_people} "
            f"Unique={len(unique_people)} "
            f"Max={max_people}"
        )

cap.release()

print()
print("========== FINAL ==========")
print("Frames:", frame_count)
print("Unique people:", len(unique_people))
print("Max occupancy:", max_people)