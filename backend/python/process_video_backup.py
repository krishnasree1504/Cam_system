#!/usr/bin/env python3
"""
CAMS - Consumer Attention Mapping System
Video Processing & Real YOLOv8 + ByteTrack Computer-Vision Analytics Engine
Strict Diagnostic Mode & Trustworthy Spatial Analysis Pipeline
"""

from __future__ import annotations
import os
import sys
import json as json_lib
import time
import math
import argparse
from pathlib import Path
from typing import Dict, List, Any, Tuple

try:
    import numpy as np
except ImportError as ie:
    print(f"[CAMS WARNING] numpy not installed: {ie}", file=sys.stderr)
    np = None

def safe_mean(data):
    if not data:
        return 0.0
    if np is not None:
        return float(np.mean(data))
    return float(sum(data) / len(data))

def safe_min(data):
    if not data:
        return 0.0
    if np is not None:
        return float(np.min(data))
    return float(min(data))

def safe_max(data):
    if not data:
        return 0.0
    if np is not None:
        return float(np.max(data))
    return float(max(data))

def safe_linspace(start, stop, num):
    if num <= 0:
        return []
    if num == 1:
        return [int(start)]
    if np is not None:
        return np.linspace(start, stop, num, dtype=int).tolist()
    step = (stop - start) / float(num - 1)
    return [int(start + i * step) for i in range(num)]

try:
    import cv2
except ImportError as ie:
    print(f"[CAMS WARNING] cv2 not installed: {ie}", file=sys.stderr)
    cv2 = None

try:
    from ultralytics import YOLO
except ImportError as ie:
    print(f"[CAMS WARNING] ultralytics YOLO not installed: {ie}", file=sys.stderr)
    YOLO = None

from analytics_utils import (
    aggregate_visits,
    compute_attention_score,
    compute_product_density,
    compute_product_engagement,
    build_customer_journeys,
    generate_insights,
    generate_optimization_opportunities,
    calculate_data_quality,
    point_in_polygon
)

def parse_args():
    parser = argparse.ArgumentParser(description="Process video with YOLOv8 + ByteTrack and generate real analytics JSON & PDF report.")
    parser.add_argument("--input", required=True, help="Path to input video file")
    parser.add_argument("--json", required=True, help="Path to output JSON analytics file")
    parser.add_argument("--pdf", required=True, help="Path to output PDF report file")
    parser.add_argument("--capacity", type=int, default=50, help="Store capacity for crowd percentage calculation")
    parser.add_argument("--conf", type=float, default=0.3, help="YOLO confidence threshold")
    parser.add_argument("--iou", type=float, default=0.45, help="YOLO IoU threshold")
    return parser.parse_args()

def generate_pdf_report(pdf_path, analytics, filename):
    """Generates an executive PDF report using pdfkit (HTML -> PDF) or minimal fallback."""
    try:
        import pdfkit
        html = f"""
        <html>
        <head><meta charset='utf-8'><title>CAMS Video Analytics Report</title></head>
        <body style='font-family:Helvetica,Arial,sans-serif; margin:40px; color:#0F172A;'>
          <h1 style='color:#0F172A; margin-bottom:4px;'>Consumer Attention Mapping System (CAMS)</h1>
          <h2 style='color:#0284C7; font-weight:500;'>Retail Video Intelligence Analytics Report</h2>
          <p><b>Video Footage:</b> Store Surveillance Recording | <b>Generated:</b> {time.strftime('%Y-%m-%d %H:%M:%S')}</p>
          <hr style='border-top:2px solid #00E676;' />
          <h3>Executive Summary</h3>
          <p>{analytics.get('aiSummary', 'No summary available.')}</p>
          <h3>Key Metrics</h3>
          <ul>
            <li>Unique Customers Tracked: {analytics.get('uniquePeople', 0)}</li>
            <li>Maximum Occupancy: {analytics.get('maxOccupancy', 0)}</li>
            <li>Average Occupancy: {analytics.get('avgOccupancy', 0)}</li>
            <li>Total Footfall: {analytics.get('totalFootfall', 0)}</li>
            <li>Average Confidence: {analytics.get('avgConfidence', '0%')}</li>
          </ul>
          <h3>Analysis Confidence</h3>
          <p><b>Confidence Level:</b> {analytics.get('dataQuality', {}).get('confidence', 'N/A')}</p>
          <p><i>{analytics.get('dataQuality', {}).get('notes', '')}</i></p>
        </body>
        </html>
        """
        pdfkit.from_string(html, pdf_path)
        print(f"[PDF Generator] Successfully generated PDF report at {pdf_path}")
        return True
    except Exception as e:
        print(f"[PDF Generator] Minimal PDF generated: {e}")
        os.makedirs(os.path.dirname(os.path.abspath(pdf_path)), exist_ok=True)
        with open(pdf_path, 'wb') as f:
            pdf_str = (
                '%PDF-1.4\n'
                '1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n'
                '2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj\n'
                '3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<</Font<</F1 4 0 R>>>>/Contents 5 0 R>>endobj\n'
                '4 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\n'
                '5 0 obj<</Length 180>>stream\n'
                'BT /F1 16 Tf 50 750 Td (CAMS Video Analytics PDF Report) Tj ET\n'
                'BT /F1 10 Tf 50 720 Td (Generated by Consumer Attention Mapping System) Tj ET\n'
                'endstream\n'
                'endobj\n'
                'xref\n0 6\n0000000000 65535 f \n0000000058 00000 n \n0000000115 00000 n \n0000000115 00000 n \n0000000242 00000 n \n0000000318 00000 n \n'
                'trailer<</Size 6/Root 1 0 R>>\n'
                'startxref\n550\n%%EOF\n'
            )
            f.write(pdf_str.encode('utf-8'))
        return True

def draw_annotated_diagnostic_frame(
    frame: Any,
    frame_idx: int,
    fps: float,
    boxes_data: List[Dict[str, Any]],
    product_dets: List[Dict[str, Any]],
    zones: List[Dict[str, Any]],
    customer_assignments: Dict[str, str]
) -> Any:
    """Draws clear diagnostic bounding boxes, shelf polygons, and association labels on frame."""
    if frame is None or cv2 is None:
        return frame

    annotated = frame.copy()
    h, w = annotated.shape[:2]

    # 1. Draw Shelf Zone Polygons with translucent overlay
    overlay = annotated.copy()
    colors = [
        (255, 120, 0),   # Shelf 1 - Blue
        (0, 200, 255),   # Shelf 2 - Yellow
        (200, 0, 255),   # Shelf 3 - Purple
        (0, 230, 115)    # Shelf 4 - Green
    ]

    for idx, zone in enumerate(zones):
        pts = zone.get("points", [])
        if len(pts) >= 3:
            poly_arr = np.array([[int(p["x"]), int(p["y"])] for p in pts], dtype=np.int32)
            color = colors[idx % len(colors)]
            cv2.fillPoly(overlay, [poly_arr], color)
            cv2.polylines(annotated, [poly_arr], True, color, 3)

            # Zone label at polygon centroid
            cx = int(np.mean([p["x"] for p in pts]))
            cy = int(np.mean([p["y"] for p in pts]))
            cv2.putText(
                annotated,
                f"SHELF: {zone.get('name', f'Zone {idx+1}')}",
                (max(10, cx - 60), max(20, cy)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (255, 255, 255),
                2
            )

    cv2.addWeighted(overlay, 0.25, annotated, 0.75, 0, annotated)

    # 2. Draw Detected Product boxes in Yellow
    for pdet in product_dets:
        bbox = pdet.get("bbox", [0, 0, 0, 0])
        px1, py1, pw, ph = bbox
        label = pdet.get("label", "SKU")
        conf = pdet.get("confidence", 0.0)
        cv2.rectangle(annotated, (px1, py1), (px1 + pw, py1 + ph), (0, 255, 255), 2)
        cv2.putText(
            annotated,
            f"{label} ({round(conf*100)}%)",
            (px1, max(15, py1 - 5)),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.5,
            (0, 255, 255),
            1
        )

    # 3. Draw Tracked Customer Bounding Boxes in Green/Cyan & Foot Point
    active_associations = []
    for bdata in boxes_data:
        cust_label = bdata.get("id", "Customer")
        conf_str = bdata.get("confidence", "0%")
        x, y, bw, bh = bdata.get("bbox", [0, 0, 0, 0])
        foot_x = x + bw // 2
        foot_y = y + bh

        # Draw Customer Bounding Box
        cv2.rectangle(annotated, (x, y), (x + bw, y + bh), (0, 255, 120), 2)
        cv2.circle(annotated, (foot_x, foot_y), 6, (0, 0, 255), -1)

        assigned_shelf = customer_assignments.get(cust_label, "In Aisle (Unassigned)")
        cv2.putText(
            annotated,
            f"{cust_label} [{conf_str}]",
            (x, max(20, y - 8)),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (0, 255, 120),
            2
        )

        active_associations.append(f"{cust_label} -> {assigned_shelf}")

    # 4. Diagnostic Banner at top
    banner_height = 40 + len(active_associations) * 22
    cv2.rectangle(annotated, (0, 0), (w, banner_height), (15, 23, 42), -1)
    time_sec = round(frame_idx / max(1.0, fps), 1)
    cv2.putText(
        annotated,
        f"[CAMS DIAGNOSTIC MODE] Frame: {frame_idx} ({time_sec}s) | Active Customers: {len(boxes_data)} | Products: {len(product_dets)}",
        (15, 25),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.6,
        (0, 230, 115),
        2
    )

    for i, assoc in enumerate(active_associations[:4]):
        cv2.putText(
            annotated,
            f"  • Association: {assoc}",
            (20, 50 + i * 20),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.5,
            (255, 255, 255),
            1
        )

    return annotated

def process_video(input_path, json_path, pdf_path, store_capacity=50, conf_thresh=0.3, iou_thresh=0.45):
    print("======================================================================")
    print("CAMS - DIAGNOSTIC COMPUTER VISION PIPELINE INITIALIZING")
    print(f"Target Video Input: {input_path}")
    print("======================================================================")
    start_time = time.time()

    PROJECT_ROOT = Path(__file__).resolve().parent
    job_id = Path(json_path).stem.replace("result_", "")
    output_dir = Path(json_path).parent

    # Candidate locations for models
    person_candidates = [
        PROJECT_ROOT / "models" / "yolov8n.pt",
        PROJECT_ROOT / "yolov8n.pt",
        Path("models/yolov8n.pt").resolve(),
        Path("yolov8n.pt").resolve(),
    ]

    person_model_path = None
    for cand in person_candidates:
        if cand.exists():
            person_model_path = cand
            break

    if not person_model_path:
        person_model_path = Path("yolov8n.pt").resolve()

    product_candidates = [
        PROJECT_ROOT / "models" / "best.pt",
        PROJECT_ROOT / "best.pt",
        Path("models/best.pt").resolve(),
        Path("best.pt").resolve(),
    ]

    product_model_path = None
    for cand in product_candidates:
        if cand.exists():
            product_model_path = cand
            break

    # ----------------------------------------------------
    # PHASE 2: VERIFY VIDEO
    # ----------------------------------------------------
    video_exists = Path(input_path).exists()
    total_frames = 0
    fps = 30.0
    width = 1920
    height = 1080
    video_opened = False

    if cv2 is not None and video_exists:
        try:
            cap = cv2.VideoCapture(str(input_path))
            if cap.isOpened():
                video_opened = True
                total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)) or 0
                fps = float(cap.get(cv2.CAP_PROP_FPS)) or 30.0
                if not fps or math.isnan(fps) or fps <= 0:
                    fps = 30.0
                width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)) or 1920
                height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)) or 1080
                cap.release()
        except Exception as cap_err:
            print(f"[CAMS DIAGNOSTIC ERROR] Video open failure: {cap_err}", file=sys.stderr)

    print("\n========== STAGE 1: VIDEO VERIFICATION ==========")
    print(f"VIDEO PATH: {input_path}")
    print(f"VIDEO EXISTS: {video_exists}")
    print(f"VIDEO OPENED: {video_opened}")
    print(f"VIDEO RESOLUTION: {width}x{height}")
    print(f"VIDEO FPS: {round(fps, 2)}")
    print(f"VIDEO TOTAL FRAMES: {total_frames}")

    if not video_exists:
        err_msg = f"Video file does not exist at path '{input_path}'. Diagnostic pipeline halted."
        print(f"[CAMS FATAL ERROR] {err_msg}", file=sys.stderr)
        err_json = {
            "error": err_msg,
            "success": False,
            "diagnostics": {
                "video": {
                    "path": str(input_path),
                    "exists": False,
                    "opened": False
                },
                "diagnosticSummaryText": f"CRITICAL FAILURE: Video file at '{input_path}' does not exist."
            }
        }
        os.makedirs(os.path.dirname(os.path.abspath(json_path)), exist_ok=True)
        with open(json_path, 'w', encoding='utf-8') as f:
            json_lib.dump(err_json, f, indent=2)
        sys.exit(1)

    if not video_opened:
        print(f"[CAMS DIAGNOSTIC NOTICE] Video at '{input_path}' exists but could not be opened by OpenCV (or cv2 not installed). Proceeding with 0-frame diagnostic analysis.")
        total_frames = total_frames or 60

    resolution_str = f"{width}x{height}"
    video_duration_sec = round(total_frames / fps, 1) if total_frames > 0 else 0.0
    minutes = int(video_duration_sec // 60)
    seconds = int(video_duration_sec % 60)
    video_length_str = f"{minutes:02d}:{seconds:02d}"

    # ----------------------------------------------------
    # PHASE 3: VERIFY PERSON DETECTOR MODEL (yolov8n.pt)
    # ----------------------------------------------------
    person_model = None
    person_model_loaded = False
    print("\n========== STAGE 2: PERSON DETECTOR MODEL (yolov8n.pt) ==========")
    print(f"PERSON MODEL PATH: {person_model_path.resolve()}")
    print(f"PERSON MODEL EXISTS: {person_model_path.exists()}")

    if YOLO is not None:
        try:
            person_model = YOLO(str(person_model_path))
            person_model_loaded = True
            print("PERSON MODEL LOADED: True")
        except Exception as pe:
            print(f"[CAMS ERROR] Person model loading failed: {pe}", file=sys.stderr)

    # ----------------------------------------------------
    # PHASE 6: VERIFY SKU-110K PRODUCT MODEL (best.pt)
    # ----------------------------------------------------
    product_model = None
    product_model_loaded = False
    print("\n========== STAGE 3: SKU PRODUCT DETECTOR MODEL (best.pt) ==========")
    if product_model_path:
        print(f"PRODUCT MODEL PATH: {product_model_path.resolve()}")
        print(f"PRODUCT MODEL EXISTS: {product_model_path.exists()}")
    else:
        print("PRODUCT MODEL PATH: None found on disk")

    if YOLO is not None and product_model_path and product_model_path.exists():
        try:
            product_model = YOLO(str(product_model_path))
            product_model_loaded = True
            print("PRODUCT MODEL LOADED: True")
        except Exception as pr_err:
            print(f"[CAMS WARNING] Product model failed to load: {pr_err}", file=sys.stderr)

    # ----------------------------------------------------
    # PHASE 8: LOAD & VALIDATE SHELF ZONES
    # ----------------------------------------------------
    zones = []
    shelves_paths = [
        Path(__file__).resolve().parent.parent / "config" / "shelves.json",
        Path(__file__).resolve().parent.parent.parent / "config" / "shelves.json",
        Path("config/shelves.json").resolve(),
    ]
    for p in shelves_paths:
        if p.exists():
            try:
                with open(p, "r", encoding="utf-8") as f:
                    zones = json_lib.load(f).get("zones", [])
                    if zones:
                        break
            except Exception as ze:
                print(f"[CAMS] Zone config load note: {ze}")

    if not zones:
        # Default 4 quad grid
        zones = [
            {"id": "shelf_1", "name": "Shelf 1", "category": "Zone 1", "points": [{"x": 0, "y": 0}, {"x": width/2, "y": 0}, {"x": width/2, "y": height/2}, {"x": 0, "y": height/2}]},
            {"id": "shelf_2", "name": "Shelf 2", "category": "Zone 2", "points": [{"x": width/2, "y": 0}, {"x": width, "y": 0}, {"x": width, "y": height/2}, {"x": width/2, "y": height/2}]},
            {"id": "shelf_3", "name": "Shelf 3", "category": "Zone 3", "points": [{"x": 0, "y": height/2}, {"x": width/2, "y": height/2}, {"x": width/2, "y": height}, {"x": 0, "y": height}]},
            {"id": "shelf_4", "name": "Shelf 4", "category": "Zone 4", "points": [{"x": width/2, "y": height/2}, {"x": width, "y": height/2}, {"x": width, "y": height}, {"x": width/2, "y": height}]}
        ]

    print("\n========== STAGE 4: SHELF ZONE CONFIGURATION ==========")
    print(f"Configured Shelf Zones Count: {len(zones)}")
    for z in zones:
        print(f"  • {z.get('id')}: {z.get('name')} ({len(z.get('points', []))} polygon points)")

    # ----------------------------------------------------
    # PHASE 4 & 5: PERSON TRACKING & ANALYSIS STREAM
    # ----------------------------------------------------
    person_frames: Dict[int, List[Tuple[int, Tuple[float, float]]]] = {} # track_id -> list of (frame_idx, (foot_x, foot_y))
    product_detections: List[Dict[str, Any]] = []
    unique_track_ids = set()
    raw_detection_count = 0
    all_confidences = []
    frame_occupancies = []
    timeline_frames = []

    line_y = height * 0.5
    track_prev_y = {}
    entered_ids = set()
    exited_ids = set()

    annotated_frames_saved = []

    if person_model is not None:
        print("\n========== STAGE 5: RUNNING PERSON TRACKING & PRODUCT DETECTION ==========")
        try:
            results = person_model.track(
                source=str(input_path),
                tracker="bytetrack.yaml",
                persist=True,
                classes=[0], # Person class
                conf=conf_thresh,
                iou=iou_thresh,
                stream=True,
                verbose=False
            )

            # Sample frames for diagnostic visualization (e.g. 5 key frames)
            diagnostic_sample_indices = set(safe_linspace(1, max(1, total_frames - 2), min(6, total_frames)))

            for frame_idx, result in enumerate(results):
                boxes = result.boxes
                frame_track_ids = []
                frame_boxes_data = []

                if boxes is not None and len(boxes) > 0:
                    ids = boxes.id.int().cpu().tolist() if boxes.id is not None else []
                    confs = boxes.conf.cpu().tolist() if boxes.conf is not None else []
                    xyxys = boxes.xyxy.cpu().tolist() if boxes.xyxy is not None else []

                    for i in range(len(boxes)):
                        raw_detection_count += 1
                        c = confs[i] if i < len(confs) else conf_thresh
                        if c < conf_thresh:
                            continue
                        all_confidences.append(c)

                        x1, y1, x2, y2 = xyxys[i]
                        cx = (x1 + x2) / 2.0
                        cy = (y1 + y2) / 2.0
                        foot_x = cx
                        foot_y = y2 # Bottom edge = foot point
                        w = x2 - x1
                        h = y2 - y1

                        if i < len(ids):
                            t_id = ids[i]
                            unique_track_ids.add(t_id)
                            frame_track_ids.append(t_id)

                            if t_id not in person_frames:
                                person_frames[t_id] = []
                            person_frames[t_id].append((frame_idx, (foot_x, foot_y)))

                            # Line crossing check
                            if t_id in track_prev_y:
                                prev_y = track_prev_y[t_id]
                                if prev_y < line_y and cy >= line_y and t_id not in entered_ids:
                                    entered_ids.add(t_id)
                                elif prev_y > line_y and cy <= line_y and t_id not in exited_ids:
                                    exited_ids.add(t_id)
                            track_prev_y[t_id] = cy

                            frame_boxes_data.append({
                                "id": f"Customer #{t_id}",
                                "label": "Person",
                                "confidence": f"{round(c * 100, 1)}%",
                                "bbox": [round(x1), round(y1), round(w), round(h)]
                            })

                current_count = len(frame_track_ids)
                frame_occupancies.append(current_count)

                time_sec = round(frame_idx / fps, 1)
                timeline_frames.append({
                    "frame_idx": frame_idx,
                    "time_sec": time_sec,
                    "count": current_count,
                    "boxes": frame_boxes_data
                })

                # Run product model on frame if loaded
                frame_product_dets = []
                if product_model is not None and result.orig_img is not None:
                    prod_res = product_model(result.orig_img, conf=conf_thresh, verbose=False)
                    if prod_res and len(prod_res) > 0 and prod_res[0].boxes is not None:
                        pboxes = prod_res[0].boxes
                        pconfs = pboxes.conf.cpu().tolist() if pboxes.conf is not None else []
                        pxyxy = pboxes.xyxy.cpu().tolist() if pboxes.xyxy is not None else []
                        pcls = pboxes.cls.cpu().tolist() if pboxes.cls is not None else []

                        for pi in range(len(pboxes)):
                            pc = pconfs[pi] if pi < len(pconfs) else conf_thresh
                            if pc < conf_thresh:
                                continue
                            px1, py1, px2, py2 = pxyxy[pi]
                            pw = px2 - px1
                            ph = py2 - py1
                            c_idx = int(pcls[pi]) if pi < len(pcls) else 0
                            c_label = product_model.names.get(c_idx, f"SKU_{c_idx+1}")

                            p_item = {
                                "bbox": [round(px1), round(py1), round(pw), round(ph)],
                                "label": c_label,
                                "class_id": c_idx,
                                "confidence": pc
                            }
                            product_detections.append(p_item)
                            frame_product_dets.append(p_item)

                # Generate Annotated Diagnostic Frame Image for Key Frames
                if cv2 is not None and result.orig_img is not None and (frame_idx in diagnostic_sample_indices or frame_idx % 100 == 0):
                    customer_assignments = {}
                    for bdata in frame_boxes_data:
                        cid_str = bdata.get("id")
                        cid_num = int(cid_str.replace("Customer #", "")) if "Customer #" in cid_str else 0
                        pframes = person_frames.get(cid_num, [])
                        if pframes:
                            last_pt = pframes[-1][1]
                            for z in zones:
                                if point_in_polygon(last_pt, z.get("points", [])):
                                    customer_assignments[cid_str] = z.get("name", z.get("id"))
                                    break

                    annotated = draw_annotated_diagnostic_frame(
                        frame=result.orig_img,
                        frame_idx=frame_idx,
                        fps=fps,
                        boxes_data=frame_boxes_data,
                        product_dets=frame_product_dets,
                        zones=zones,
                        customer_assignments=customer_assignments
                    )

                    diag_filename = f"annotated_{job_id}_frame_{frame_idx}.jpg"
                    diag_path = output_dir / diag_filename
                    cv2.imwrite(str(diag_path), annotated)
                    annotated_frames_saved.append({
                        "frameIdx": frame_idx,
                        "timeSec": time_sec,
                        "filename": diag_filename,
                        "url": f"/uploads/{diag_filename}"
                    })

        except Exception as track_err:
            print(f"[CAMS ERROR] Person tracking process failure: {track_err}", file=sys.stderr)

    # Filter out short noisy tracks (< 1.0s)
    min_track_duration_sec = 1.0
    min_track_frames = int(min_track_duration_sec * fps)
    valid_person_frames = {
        pid: f_list for pid, f_list in person_frames.items() if len(f_list) >= min_track_frames
    }

    valid_track_ids = set(valid_person_frames.keys())
    unique_people_count = len(valid_track_ids)

    track_durations = [len(f_list) / fps for f_list in valid_person_frames.values()]
    avg_track_duration_sec = round(safe_mean(track_durations), 1) if track_durations else 0.0

    print("\n========== STAGE 6: TRACK QUALITY VERIFICATION ==========")
    print(f"Total Raw Detections: {raw_detection_count}")
    print(f"Unique Persistent Track IDs: {len(unique_track_ids)}")
    print(f"Valid Tracks (>= {min_track_duration_sec}s): {unique_people_count}")
    print(f"Average Track Duration: {avg_track_duration_sec}s")

    # STRICT: DO NOT invent mock data if 0 tracks are detected!
    if unique_people_count == 0:
        print("[CAMS DIAGNOSTIC NOTICE] 0 valid customer tracks detected. Proceeding with real zero-detection reporting.")

    # ----------------------------------------------------
    # COMPUTING REAL SPATIAL & TEMPORAL ANALYTICS
    # ----------------------------------------------------
    total_frames_processed = len(timeline_frames)
    if len(frame_occupancies) == 0:
        frame_occupancies = [0]

    current_occupancy = frame_occupancies[-1] if frame_occupancies else 0
    max_occupancy = max(frame_occupancies) if frame_occupancies else 0
    min_occupancy = min(frame_occupancies) if frame_occupancies else 0
    avg_occupancy = round(safe_mean(frame_occupancies), 1) if frame_occupancies else 0.0

    entries_count = len(entered_ids)
    exits_count = len(exited_ids)
    total_footfall = max(unique_people_count, entries_count + exits_count)

    crowd_percentage = min(100.0, round((max_occupancy / float(max(1, store_capacity))) * 100.0, 1))
    if crowd_percentage <= 20.0:
        crowd_level = "Very Low"
    elif crowd_percentage <= 40.0:
        crowd_level = "Low"
    elif crowd_percentage <= 60.0:
        crowd_level = "Medium"
    elif crowd_percentage <= 80.0:
        crowd_level = "High"
    else:
        crowd_level = "Very High"

    if len(all_confidences) > 0:
        avg_conf = round(safe_mean(all_confidences) * 100.0, 1)
        min_conf = round(safe_min(all_confidences) * 100.0, 1)
        max_conf = round(safe_max(all_confidences) * 100.0, 1)
    else:
        avg_conf = 0.0
        min_conf = 0.0
        max_conf = 0.0

    processing_time_sec = round(time.time() - start_time, 2)

    # Timeline sampling for UI
    num_points = 12
    step_idx = max(1, len(timeline_frames) // num_points) if len(timeline_frames) > 0 else 1
    sampled_timeline = timeline_frames[::step_idx][:num_points] if len(timeline_frames) > 0 else []

    crowd_over_time = []
    occupancy_trend = []
    crowd_heat_timeline = []

    for item in sampled_timeline:
        ts = item['time_sec']
        t_str = f"{int(ts // 60):02d}:{int(ts % 60):02d}"
        cnt = item['count']
        cpct = min(100.0, round((cnt / float(max(1, store_capacity))) * 100.0, 1))

        crowd_over_time.append({"time": t_str, "peopleCount": cnt, "occupancy": cnt, "crowdPercentage": cpct})
        occupancy_trend.append({"time": t_str, "occupancy": cnt, "maxCapacity": store_capacity})
        crowd_heat_timeline.append({
            "time": t_str,
            "crowdPercentage": cpct,
            "status": "High" if cpct > 60 else ("Medium" if cpct > 40 else "Low")
        })

    # Sample preview frames for UI
    sample_preview_indices = safe_linspace(0, max(0, len(timeline_frames) - 1), min(5, len(timeline_frames))) if len(timeline_frames) > 0 else []
    preview_frames = []
    for idx in sample_preview_indices:
        if idx < len(timeline_frames):
            tf = timeline_frames[idx]
            ts = tf['time_sec']
            t_str = f"{int(ts // 60):02d}:{int(ts % 60):02d}"
            preview_frames.append({
                "frameNumber": tf['frame_idx'],
                "timestamp": t_str,
                "detectedCount": len(tf['boxes']),
                "boxes": tf['boxes']
            })

    # ----------------------------------------------------
    # SPATIAL & PRODUCT ANALYTICS
    # ----------------------------------------------------
    shelf_metrics, person_paths = aggregate_visits(
        valid_person_frames, 
        zones,
        fps, 
        min_visit_seconds=2.0
        )
    attention_scores = compute_attention_score(shelf_metrics)
    most_attended_shelf = (
        max(attention_scores, key=attention_scores.get) 
        if attention_scores and any(attention_scores.values()) 
        else None
    )

    product_density = compute_product_density(
        product_detections, 
        zones
        )
    product_engagement = compute_product_engagement(
        product_detections, 
        valid_person_frames,
        zones, 
        fps
        )
         # ----------------------------------------------------
# REAL PRODUCT DETECTION METRICS
# ----------------------------------------------------
    from collections import Counter

    total_products_detected = len(product_detections)

    product_categories = Counter(
        str(p.get("label", "Unknown"))
        for p in product_detections
    )

    products_per_category = dict(product_categories)

    most_frequent_product = (
        product_categories.most_common(1)[0][0]
        if product_categories
        else None
    )

    product_confidences = [
        float(p.get("confidence", 0.0))
        for p in product_detections
        if isinstance(p.get("confidence"), (int, float))
    ]

    average_product_confidence = (
        round(safe_mean(product_confidences) * 100.0, 1)
        if product_confidences
        else 0.0
    )

    print("\n========== PRODUCT DETECTION METRICS ==========")
    print(f"Total Product Detections: {total_products_detected}")
    print(f"Product Categories: {products_per_category}")
    print(f"Most Frequent Product: {most_frequent_product}")
    print(f"Average Product Confidence: {average_product_confidence}%")
         
         
    most_common_path, avg_shelves_visited, avg_journey_duration_sec, total_visits = build_customer_journeys(person_paths)
    insights = generate_insights(shelf_metrics, attention_scores, most_attended_shelf)
    optimizations = generate_optimization_opportunities(shelf_metrics, attention_scores, most_attended_shelf)
    data_quality = calculate_data_quality(unique_people_count, total_frames_processed, len(product_detections), avg_conf)

    # Generate Heatmap Points
    heatmap_data = []
    for pid, pframes in valid_person_frames.items():
        for f_idx, (fx, fy) in pframes:
            assigned_zone = None
            for z in zones:
                if point_in_polygon((fx, fy), z.get("points", [])):
                    assigned_zone = z["id"]
                    break
            heatmap_data.append({
                "x": round(fx, 1),
                "y": round(fy, 1),
                "intensity": 1.0,
                "shelfId": assigned_zone or "unassigned"
            })

    # Summary text
    if unique_people_count > 0:
        ai_summary = (
            f"Retail computer vision analysis completed for store video footage ({video_length_str}). "
            f"Tracked {unique_people_count} unique shoppers. "
            f"Peak simultaneous occupancy reached {max_occupancy} customers (Avg: {avg_occupancy}). "
            f"Registered {entries_count} entries and {exits_count} exits with {avg_conf}% average detection confidence."
        )
    else:
        ai_summary = (
            f"Retail video analysis completed for store video footage ({video_length_str}). "
            f"0 customers were detected in the video stream. "
            f"Please verify camera angle, lighting, and detection confidence settings."
        )

    ai_recommendations = [
        f"Tracked {unique_people_count} unique shoppers. Analysis confidence level: {data_quality.get('confidence')}.",
        f"Current crowd density level is {crowd_level} ({crowd_percentage}%).",
        f"Recorded {entries_count} entrance line crossings and {exits_count} exit crossings."
    ]

    total_dwell_all_shelves = sum(m.get("totalDwellSeconds", 0.0) for m in shelf_metrics.values())
    total_shelf_visits_count = sum(m.get("visits", 0) for m in shelf_metrics.values())

    # ----------------------------------------------------
    # PHASE 21: CRITICAL DIAGNOSTIC SUMMARY
    # ----------------------------------------------------
    diag_summary_text = (
        "======================================================================\n"
        "CAMS CRITICAL DIAGNOSTIC SUMMARY\n"
        "======================================================================\n"
        f"1. Video File: {input_path} ({width}x{height} @ {round(fps, 1)} FPS, {total_frames} frames)\n"
        f"2. Person Model (yolov8n.pt): {'LOADED' if person_model_loaded else 'FAILED'}\n"
        f"3. Person Tracking (ByteTrack): {raw_detection_count} raw detections -> {len(unique_track_ids)} unique tracks ({unique_people_count} valid >= 1.0s)\n"
        f"4. Product Model (best.pt): {'LOADED' if product_model_loaded else 'NOT PRESENT'} ({len(product_detections)} product detections)\n"
        f"5. Shelf Zones: {len(zones)} zones configured\n"
        f"6. Customer-Shelf Associations: {total_shelf_visits_count} valid shelf visits recorded\n"
        f"7. Total Dwell Time: {total_dwell_all_shelves}s across all shelves\n"
        f"8. Product Associations: {len(product_engagement)} product classes with engagement\n"
        f"9. Data Quality Rating: {data_quality.get('confidence')} ({data_quality.get('notes')})\n"
        "======================================================================"
    )

    print("\n" + diag_summary_text + "\n")

    diagnostics = {
        "video": {
            "path": str(input_path),
            "exists": video_exists,
            "opened": video_opened,
            "width": width,
            "height": height,
            "fps": round(fps, 1),
            "totalFrames": total_frames
        },
        "personModel": {
            "path": str(person_model_path.resolve()),
            "exists": person_model_path.exists(),
            "loaded": person_model_loaded
        },
        "productModel": {
            "path": str(product_model_path.resolve()) if product_model_path else "None",
            "exists": product_model_path.exists() if product_model_path else False,
            "loaded": product_model_loaded,
            "detectionsCount": len(product_detections)
        },
        "tracking": {
            "rawDetectionsTotal": raw_detection_count,
            "uniqueTrackedCustomers": len(unique_track_ids),
            "validTracksCount": unique_people_count,
            "averageTrackDurationSec": avg_track_duration_sec
        },
        "shelf": {
            "configuredZonesCount": len(zones),
            "shelfVisitsCount": total_shelf_visits_count,
            "totalDwellSeconds": total_dwell_all_shelves
        },
        "annotatedFrames": annotated_frames_saved,
        "quality": data_quality,
        "diagnosticSummaryText": diag_summary_text
    }

    analytics = {
        "success": True,
        "totalPeople": total_footfall,
        "uniquePeople": unique_people_count,
        "maxCrowd": max_occupancy,
        "minCrowd": min_occupancy,
        "avgCrowd": avg_occupancy,
        "crowdPercentage": crowd_percentage,
        "crowdLevel": crowd_level,
        "entries": entries_count,
        "exits": exits_count,
        "totalFootfall": total_footfall,
        "maxOccupancy": max_occupancy,
        "currentOccupancy": current_occupancy,
        "avgOccupancy": avg_occupancy,
        "videoLength": video_length_str,
        "fps": round(fps, 1),
        "totalFrames": total_frames,
        "framesProcessed": total_frames_processed,
        "resolution": resolution_str,
        "totalObjects": unique_people_count,
        "peopleCount": unique_people_count,
        "avgConfidence": f"{avg_conf}%",
        "minConfidence": f"{min_conf}%",
        "maxConfidence": f"{max_conf}%",
        "processingTime": processing_time_sec,
        "crowdOverTime": crowd_over_time,
        "occupancyTrend": occupancy_trend,
        "crowdHeatTimeline": crowd_heat_timeline,
        "previewFrames": preview_frames,
        "aiSummary": ai_summary,
        "aiRecommendations": ai_recommendations,
        # Shelf zone analytics
        "shelfMetrics": shelf_metrics,
        "attentionScores": attention_scores,
        "mostAttendedShelf": most_attended_shelf,
        "productDensity": product_density,
        "productEngagement": product_engagement,
        # Real product detection analytics
        "totalProductsDetected": total_products_detected,
        "productsPerCategory": products_per_category,
        "mostFrequentProduct": most_frequent_product,
        "averageProductConfidence": f"{average_product_confidence}%",
        "customerJourney": {
            "mostCommonPath": most_common_path,
            "averageShelvesVisited": avg_shelves_visited,
            "averageJourneyDurationSec": avg_journey_duration_sec,
            "totalVisits": total_visits
        },
        "insights": insights,
        "optimizations": optimizations,
        "dataQuality": data_quality,
        "heatmapData": heatmap_data,
        "diagnostics": diagnostics
    }

    # Save output JSON file
    os.makedirs(os.path.dirname(os.path.abspath(json_path)), exist_ok=True)
    with open(json_path, 'w', encoding='utf-8') as f:
        json_lib.dump(analytics, f, indent=2)

    print(f"[CAMS Processor] Saved analysis JSON to: {json_path}")

    # Generate PDF report
    generate_pdf_report(pdf_path, analytics, input_path)
    print(f"[CAMS Processor] Completed video analytics pipeline for {input_path}")

if __name__ == "__main__":
    args = parse_args()
    process_video(
        input_path=args.input,
        json_path=args.json,
        pdf_path=args.pdf,
        store_capacity=args.capacity,
        conf_thresh=args.conf,
        iou_thresh=args.iou
    )
