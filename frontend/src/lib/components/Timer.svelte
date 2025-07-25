<script lang="ts">
  const { endTime }: { endTime: number } = $props();

  let timeLeft = $state({ minutes: 0, seconds: 0, total: 0 });
  let intervalId: number;

  function updateCountdown() {
    const now = Date.now();
    const difference = endTime - now;

    if (difference <= 0) {
      timeLeft = { minutes: 0, seconds: 0, total: 0 };
      if (intervalId) clearInterval(intervalId);
      return;
    }

    const minutes = Math.floor(difference / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    timeLeft = { minutes, seconds, total: difference };
  }

  $effect(() => {
    updateCountdown();
    intervalId = setInterval(updateCountdown, 1000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  });
</script>

<div>
  {timeLeft.total <= 0
    ? "0:00"
    : `${timeLeft.minutes}:${timeLeft.seconds.toString().padStart(2, "0")}`}
</div>
