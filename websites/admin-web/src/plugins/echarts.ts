import type { EChartsOption } from 'echarts';
import {
  BarChart,
  LineChart,
  MapChart,
  PictorialBarChart,
  PieChart,
  RadarChart,
  ScatterChart,
} from 'echarts/charts';
import {
  AriaComponent,
  CalendarComponent,
  DataZoomComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  ParallelComponent,
  PolarComponent,
  RadarComponent,
  TimelineComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers';
import { Ref } from 'vue';

echarts.use([
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  PolarComponent,
  AriaComponent,
  ParallelComponent,
  BarChart,
  LineChart,
  PieChart,
  MapChart,
  RadarChart,

  PictorialBarChart,
  RadarComponent,
  ToolboxComponent,
  DataZoomComponent,
  VisualMapComponent,
  TimelineComponent,
  CalendarComponent,
  GraphicComponent,
  ScatterChart,
]);

export default echarts;

export enum RenderType {
  SVGRenderer = 'SVGRenderer',
  CanvasRenderer = 'CanvasRenderer',
}

export enum ThemeType {
  Light = 'light',
  Dark = 'dark',
  Default = 'default',
}

export function useChart(
  elRef: Ref<HTMLDivElement>,
  autoChartSize = false,
  animation: boolean = false,
  render: RenderType = RenderType.SVGRenderer,
  theme: ThemeType = ThemeType.Default,
) {
  // 渲染模式
  echarts.use(render === RenderType.SVGRenderer ? SVGRenderer : CanvasRenderer);
  // echart实例
  let chartInstance: echarts.ECharts | null = null;

  // 初始化echart
  const initCharts = () => {
    const el = unref(elRef);
    if (!el || !unref(el)) {
      return;
    }
    chartInstance = echarts.init(el, theme);
  };

  // 更新/设置配置
  const setOption = (option: EChartsOption) => {
    nextTick(() => {
      if (!chartInstance) {
        initCharts();
        if (!chartInstance) return;
      }

      chartInstance.setOption(option);
      hideLoading();
    });
  };

  // 获取echart实例
  function getInstance(): echarts.ECharts | null {
    if (!chartInstance) {
      initCharts();
    }
    return chartInstance;
  }

  // 更新大小
  function resize() {
    chartInstance?.resize();
  }

  // 监听元素大小
  function watchEl() {
    // 给元素添加过渡
    if (animation) {
      elRef.value.style.transition = 'width 1s, height 1s';
    }
    const resizeObserver = new ResizeObserver((entries) => resize());
    resizeObserver.observe(elRef.value);
  }

  // 显示加载状态
  function showLoading() {
    if (!chartInstance) {
      initCharts();
    }
    chartInstance?.showLoading();
  }
  // 显示加载状态
  function hideLoading() {
    if (!chartInstance) {
      initCharts();
    }
    chartInstance?.hideLoading();
  }

  onMounted(() => {
    window.addEventListener('resize', resize);
    if (autoChartSize) watchEl();
  });

  onUnmounted(() => {
    window.removeEventListener('resize', resize);
  });

  return {
    setOption,
    getInstance,
    showLoading,
    hideLoading,
  };
}
