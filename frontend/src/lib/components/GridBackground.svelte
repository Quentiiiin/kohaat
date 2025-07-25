<script lang="ts">
    let gridColor: string = "#e0e0e0"; // Light gray by default
    let gridSpacing: number = 20; // Spacing in pixels
</script>

<div
    style="
      background-color: white;
      background-image: linear-gradient(to right, {gridColor} 1px, transparent 1px),
                        linear-gradient(to bottom, {gridColor} 1px, transparent 1px);
      background-size: {gridSpacing}px {gridSpacing}px;
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1; /* Ensure it's behind other content */
    "
></div>
