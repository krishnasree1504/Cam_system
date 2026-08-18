from pathlib import Path
import cv2
import mediapipe as mp
import numpy as np


class GazeEstimator:

    def __init__(self, model_path=None):

        if model_path is None:
            model_path = (
                Path(__file__).parent
                / "models"
                / "face"
                / "face_landmarker.task"
            )

        self.model_path = Path(model_path)

        if not self.model_path.exists():
            raise FileNotFoundError(
                f"Face Landmarker model not found: "
                f"{self.model_path}"
            )

        BaseOptions = mp.tasks.BaseOptions
        FaceLandmarker = mp.tasks.vision.FaceLandmarker
        FaceLandmarkerOptions = mp.tasks.vision.FaceLandmarkerOptions
        RunningMode = mp.tasks.vision.RunningMode

        options = FaceLandmarkerOptions(
            base_options=BaseOptions(
                model_asset_path=str(self.model_path)
            ),
            running_mode=RunningMode.IMAGE,
            num_faces=1,
            min_face_detection_confidence=0.5,
            min_face_presence_confidence=0.5,
            min_tracking_confidence=0.5,
            output_face_blendshapes=False,
            output_facial_transformation_matrixes=False
        )

        self.landmarker = FaceLandmarker.create_from_options(
            options
        )

    def estimate(self, frame):

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        mp_image = mp.Image(
            image_format=mp.ImageFormat.SRGB,
            data=rgb
        )

        result = self.landmarker.detect(mp_image)

        if not result.face_landmarks:
            return {
                "direction": "UNKNOWN",
                "confidence": 0.0,
                "yaw": None,
                "pitch": None
            }

        landmarks = result.face_landmarks[0]

        # Important face landmarks
        nose = landmarks[1]
        forehead = landmarks[10]
        chin = landmarks[152]
        left_face = landmarks[234]
        right_face = landmarks[454]

        # Calculate approximate face orientation.
        face_center_x = (
            left_face.x + right_face.x
        ) / 2

        face_center_y = (
            forehead.y + chin.y
        ) / 2

        # Horizontal deviation
        horizontal = nose.x - face_center_x

        # Vertical deviation
        vertical = nose.y - face_center_y

        # Thresholds
        horizontal_threshold = 0.035
        vertical_threshold = 0.025

        if vertical < -vertical_threshold:
            direction = "UP"

        elif vertical > vertical_threshold:
            direction = "DOWN"

        elif horizontal < -horizontal_threshold:
            direction = "LEFT"

        elif horizontal > horizontal_threshold:
            direction = "RIGHT"

        else:
            direction = "FORWARD"

        # Simple confidence based on face visibility.
        confidence = min(
            1.0,
            max(
                0.0,
                1.0 - (
                    abs(horizontal) +
                    abs(vertical)
                )
            )
        )

        return {
            "direction": direction,
            "confidence": round(float(confidence), 3),
            "yaw": round(float(horizontal), 4),
            "pitch": round(float(vertical), 4)
        }

    def close(self):
        self.landmarker.close()