import cv2, numpy as np, os

output_dir = os.path.abspath('output')
os.makedirs(output_dir, exist_ok=True)
video_path = os.path.join(output_dir, 'sample.mp4')
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter(video_path, fourcc, 30.0, (640, 480))
for i in range(60):  # 2 seconds at 30 fps
    frame = np.zeros((480, 640, 3), dtype=np.uint8)
    # draw a moving rectangle to simulate activity
    top_left = (i*5 % 640, i*3 % 480)
    bottom_right = ((i*5 + 50) % 640, (i*3 + 50) % 480)
    cv2.rectangle(frame, top_left, bottom_right, (0, 255, 0), -1)
    out.write(frame)
out.release()
print('Dummy video created at', video_path)
