import {
  Profiler,
  ProfilerProps,
  PropsWithChildren,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button, Code } from "@nextui-org/react";
import { useStableCallback } from "../hooks/use-stable-callback";
import { Line } from "react-chartjs-2";

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

type LinePlotProps = {
  list: ProfiledData[];
  label: string;
  selector: (data: ProfiledData) => number;
  color: string;
};
function LinePlot({ list, label, selector, color }: LinePlotProps) {
  const config = useMemo(
    () => ({
      labels: list.map((_, i) => i),
      datasets: [
        {
          label,
          data: list.map((e) => selector(e)),
          fill: false,
          borderColor: color,
          tension: 0.4,
        },
      ],
    }),
    [color, label, list, selector]
  );

  return (
    <div className="mt-2">
      <Line options={plotOptions} data={config} />
      <p className="text-center text-xs text-slate-500">{label}</p>
    </div>
  );
}

type ProfilePlotProps = {
  list: ProfiledData[];
};

const plotOptions = { animation: false } as const;

function ProfilePlot({ list }: ProfilePlotProps) {
  const selectRenderDuration = useStableCallback(
    (data: ProfiledData) => data.averageRenderDuration
  );
  const selectRenderCount = useStableCallback(
    (data: ProfiledData) => data.count
  );
  const selectTimeSpent = useStableCallback(
    (data: ProfiledData) =>
      data.count * (data.averageRenderDuration + data.averageCommitDuation)
  );

  return (
    <>
      <LinePlot
        color="rgba(252,127,3)"
        label="Render Count"
        list={list}
        selector={selectRenderCount}
      />
      <LinePlot
        color="rgba(52,107,235)"
        label="Render Duration"
        list={list}
        selector={selectRenderDuration}
      />
      <LinePlot
        color="rgba(119,150,6)"
        label="Total time spent"
        list={list}
        selector={selectTimeSpent}
      />
    </>
  );
}

type MemoizedProfilerProps = ProfilerProps;

const MemoizedProfiler = memo(
  (props: PropsWithChildren<MemoizedProfilerProps>) => {
    return <Profiler {...props} />;
  }
);
MemoizedProfiler.displayName = "MemoizedProfiler";

export type PageProfilerProps = {
  durationMs?: number;
};

export function PageProfiler({
  children,
  durationMs = 1000,
}: PropsWithChildren<PageProfilerProps>) {
  const [isProfiling, setIsProfiling] = useState(false);
  const timerRef = useRef<number | null>(null);
  const renderDurations = useRef<ProfileEvent[]>([]);
  const profiledDataListRef = useRef<ProfiledData[]>([]);
  const [profiledDataState, setProfiledDataState] = useState<ProfiledData[]>(
    []
  );
  const [profiledData, setProfiledData] =
    useState<ProfiledData>(defaultProfiledData);

  const handleReset = useStableCallback(() => {
    timerRef.current = null;
    renderDurations.current = [];
    profiledDataListRef.current = [];
    setProfiledData(defaultProfiledData);
    setProfiledDataState([]);
  });

  const handleShowPlot = useStableCallback(() => {
    setProfiledDataState([...profiledDataListRef.current]);
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

        const profiledData = {
          count,
          averageRenderDuration,
          averageCommitDuation,
        };
        setProfiledData(profiledData);
        if (count > 0) {
          profiledDataListRef.current.push(profiledData);
        }
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
      if (isProfiling && reason === "update") {
        renderDurations.current.push({
          render,
          commit: updateEnd - updateStart - render,
        });
      }
    }
  );

  return (
    <article>
      <MemoizedProfiler id="Content" onRender={onRender}>
        {children}
      </MemoizedProfiler>
      <footer className="py-6">
        <div className="flex align-middle gap-2">
          <Button
            variant="flat"
            color="primary"
            onClick={handleProfilingButtonClick}
          >
            {isProfiling ? "Stop Profiling" : "Start Profiling"}
          </Button>
          <Button variant="light" color="primary" onClick={handleReset}>
            Reset Profiling Data
          </Button>
          <Button variant="light" color="primary" onClick={handleShowPlot}>
            Plot Graph
          </Button>
        </div>
        <p className="mt-4">
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
        <div className="pt-2">
          <ProfilePlot list={profiledDataState} />
        </div>
      </footer>
    </article>
  );
}
