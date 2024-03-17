import {
  Profiler,
  ProfilerProps,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button, Code } from "@nextui-org/react";
import { useStableCallback } from "../hooks/use-stable-callback";

export type PageProfilerProps = {
  durationMs?: number;
};

type ProfiledData = {
  averageDuration: number;
  count: number;
};

const defaultProfiledData = {
  averageDuration: 0,
  count: 0,
};

export function PageProfiler({
  children,
  durationMs = 3000,
}: PropsWithChildren<PageProfilerProps>) {
  const [isProfiling, setIsProfiling] = useState(false);
  const timerRef = useRef<number | null>(null);
  const renderDurations = useRef<number[]>([]);
  const [profiledData, setProfiledData] =
    useState<ProfiledData>(defaultProfiledData);

  const handleReset = useStableCallback(() => {
    timerRef.current = null;
    renderDurations.current = [];
    setProfiledData(defaultProfiledData);
  });

  const handleProfilingButtonClick = useStableCallback(() => {
    if (timerRef.current) {
      return;
    }

    setIsProfiling(true);
    timerRef.current = setTimeout(() => {
      const count = renderDurations.current.length;
      const averageDuration = count
        ? renderDurations.current.reduce((prev, curr) => prev + curr, 0) / count
        : 0;
      setProfiledData({
        count,
        averageDuration,
      });
      setIsProfiling(false);
      timerRef.current = null;
      renderDurations.current = [];
    }, durationMs);
  });

  useEffect(
    () => () => {
      timerRef.current && clearTimeout(timerRef.current);
    },
    []
  );

  const onRender: ProfilerProps["onRender"] = useStableCallback(
    (_, reason, duration) => {
      if (reason === "update" && duration >= 5) {
        renderDurations.current.push(duration);
      }
    }
  );

  return (
    <article>
      <Profiler id="Content" onRender={onRender}>
        {children}
      </Profiler>
      <footer className="mt-6">
        <div className="flex align-middle gap-2">
          <Button
            variant="flat"
            color="primary"
            onClick={handleProfilingButtonClick}
            isLoading={isProfiling}
          >
            {isProfiling ? "Profiling" : "Start Profiling"}
          </Button>
          <Button
            variant="light"
            color="primary"
            onClick={handleReset}
            disabled={isProfiling}
          >
            Reset Profiling Data
          </Button>
        </div>
        <p className="mt-2">
          <Code>
            Average Duaration: {profiledData.averageDuration.toFixed(2)}ms
            <br />
            Renders: {profiledData.count}
          </Code>
        </p>
      </footer>
    </article>
  );
}
