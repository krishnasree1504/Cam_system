"""Configurable shelf zone helpers for retail video analytics."""
from __future__ import annotations

from typing import Any, Dict, List


def generate_default_zones(width: int, height: int) -> List[Dict[str, Any]]:
    """Create four proportional shelf zones mapped to video resolution.

    Zones divide the frame into quadrants. Override by placing zones.json
    alongside the analytics output in backend/uploads/.
    """
    w = max(1, width)
    h = max(1, height)
    mid_x = w // 2
    mid_y = h // 2

    return [
        {
            "id": "shelf_1",
            "name": "Shelf 1",
            "category": "Top Left",
            "points": [
                {"x": 0, "y": 0},
                {"x": mid_x, "y": 0},
                {"x": mid_x, "y": mid_y},
                {"x": 0, "y": mid_y},
            ],
        },
        {
            "id": "shelf_2",
            "name": "Shelf 2",
            "category": "Top Right",
            "points": [
                {"x": mid_x, "y": 0},
                {"x": w, "y": 0},
                {"x": w, "y": mid_y},
                {"x": mid_x, "y": mid_y},
            ],
        },
        {
            "id": "shelf_3",
            "name": "Shelf 3",
            "category": "Bottom Left",
            "points": [
                {"x": 0, "y": mid_y},
                {"x": mid_x, "y": mid_y},
                {"x": mid_x, "y": h},
                {"x": 0, "y": h},
            ],
        },
        {
            "id": "shelf_4",
            "name": "Shelf 4",
            "category": "Bottom Right",
            "points": [
                {"x": mid_x, "y": mid_y},
                {"x": w, "y": mid_y},
                {"x": w, "y": h},
                {"x": mid_x, "y": h},
            ],
        },
    ]


def load_or_create_zones(
    job_dir: str,
    width: int,
    height: int,
) -> List[Dict[str, Any]]:
    """Load zones.json from job directory or generate defaults and persist them."""
    import json
    import os

    zones_path = os.path.join(job_dir, "zones.json")
    if os.path.exists(zones_path):
        with open(zones_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            zones = data.get("zones", [])
            if zones:
                return zones

    zones = generate_default_zones(width, height)
    with open(zones_path, "w", encoding="utf-8") as f:
        json.dump({"zones": zones, "source": "auto_generated", "resolution": f"{width}x{height}"}, f, indent=2)
    return zones
