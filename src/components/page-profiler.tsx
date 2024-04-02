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

type ProfileEvent = {
  render: number;
  commit: number;
};

type ProfiledData = {
  averageRenderDuration: number;
  averageCommitDuation: number;
  count: number;
};

const defaultProfiledData: ProfiledData = {
  averageCommitDuation: 0,
  averageRenderDuration: 0,
  count: 0,
};

export function PageProfiler({
  children,
  durationMs = 1000,
}: PropsWithChildren<PageProfilerProps>) {
  const [isProfiling, setIsProfiling] = useState(false);
  const timerRef = useRef<number | null>(null);
  const renderDurations = useRef<ProfileEvent[]>([]);
  const [profiledData, setProfiledData] =
    useState<ProfiledData>(defaultProfiledData);

  const handleReset = useStableCallback(() => {
    timerRef.current = null;
    renderDurations.current = [];
    setProfiledData(defaultProfiledData);
  });

  const handleProfilingButtonClick = useStableCallback(() => {
    if (isProfiling) {
      timerRef.current && clearInterval(timerRef.current);
      setIsProfiling(false);
      timerRef.current = null;
    } else {
      setIsProfiling(true);
      timerRef.current = setInterval(() => {
        const count = renderDurations.current.length;
        const averageRenderDuration = count
          ? renderDurations.current.reduce(
              (prev, curr) => prev + curr.render,
              0
            ) / count
          : 0;
        const averageCommitDuation = count
          ? renderDurations.current.reduce(
              (prev, curr) => prev + curr.commit,
              0
            ) / count
          : 0;

        setProfiledData({
          count,
          averageRenderDuration,
          averageCommitDuation,
        });
        renderDurations.current = [];
      }, durationMs);
    }
  });

  useEffect(
    () => () => {
      timerRef.current && clearInterval(timerRef.current);
    },
    []
  );

  const onRender: ProfilerProps["onRender"] = useStableCallback(
    (_, reason, render, __, updateStart, updateEnd) => {
      if (isProfiling && reason === "update" && render >= 5) {
        renderDurations.current.push({
          render,
          commit: updateEnd - updateStart - render,
        });
      }
    }
  );

  return (
    <article className="py-6">
      <Profiler id="Content" onRender={onRender}>
        {children}
      </Profiler>
      <footer className="mt-6">
        <div className="flex align-middle gap-2">
          <Button
            variant="flat"
            color="primary"
            onClick={handleProfilingButtonClick}
          >
            {isProfiling ? "Stop Profiling" : "Start Profiling"}
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
            Average Render Duration:{" "}
            {profiledData.averageRenderDuration.toFixed(2)}ms
            <br />
            Average Commit Duration:{" "}
            {profiledData.averageCommitDuation.toFixed(2)}ms
            <br />
            Renders: {profiledData.count}
          </Code>
        </p>
      </footer>
    </article>
  );
}
