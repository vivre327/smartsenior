// Datalabels 등록
Chart.register(ChartDataLabels);

const getFontSize = () => {
  return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--font-12').trim());
};

// 현재 CSS 변수 기반 폰트 크기 가져오기
const fontSize = getFontSize();

// Pie Chart : 헬스케어 키오스크
const healthcare = document.getElementById("healthcareChart");
const healthcareChart = new Chart(healthcare, {
  type: "pie",
  data: {
    labels: ["정보 수신", "정보 미수신"],
    datasets: [
      {
        data: [49, 1],
        backgroundColor: ["#0066ff", "#ff9933"],
        borderWidth: 0,
      },
    ],
  },
  options: {
    layout: {
      padding: 15,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
      labels: {
        position: "outside",
        textMargin: 5,
        fontSize: fontSize,
        fontWeight: "800",
        fontColor: "#ff9933",
        // value 5보다 작으면 외부에 표시
        render: (ctx) => {
          // console.log(ctx);
          if (ctx.value < 5) {
            return ctx.percentage + "%";
          }
        },
      },
      datalabels: {
        align: "center",
        color: "#fff",
        font: {
          family: "NanumSquare",
          weight: "800",
          size: fontSize,
        },
        // 퍼센테이지 값 표시
        formatter: (value, context) => {
          // console.log(context.chart.data.datasets[0].data);
          const datapoints = context.chart.data.datasets[0].data;
          function totalSum(total, datapoint) {
            return total + datapoint;
          }

          const totalValue = datapoints.reduce(totalSum, 0);
          const percentageValue = (value / totalValue) * 100;
          // console.log(totalPercentage);
          if (value < 5) {
            return "";
          } else {
            return `${percentageValue}%`;
          }
        },
      },
    },
    animation: {
      duration: 0,
    },
  },
});

// Pie Chart : 종합정보 모니터
const monitor = document.getElementById("monitorChart");
const monitorChart = new Chart(monitor, {
  type: "pie",
  data: {
    labels: ["정보 수신", "정보 미수신"],
    datasets: [
      {
        data: [46, 4],
        backgroundColor: ["#0066ff", "#ff9933"],
        borderWidth: 0,
      },
    ],
  },
  options: {
    layout: {
      padding: 15,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
      labels: {
        position: "outside",
        textMargin: 5,
        fontSize: fontSize,
        fontWeight: "800",
        fontColor: "#ff9933",
        render: (ctx) => {
          // console.log(ctx);
          if (ctx.value < 5) {
            return ctx.percentage + "%";
          }
        },
      },
      datalabels: {
        align: "center",
        color: "#fff",
        font: {
          family: "NanumSquare",
          weight: "800",
          size: fontSize,
        },
        formatter: (value, context) => {
          // console.log(value);
          console.log(context.chart.data.datasets[0].data);
          const datapoints = context.chart.data.datasets[0].data;
          function totalSum(total, datapoint) {
            return total + datapoint;
          }

          const totalValue = datapoints.reduce(totalSum, 0);
          const percentageValue = (value / totalValue) * 100;
          // console.log(totalPercentage);
          if (value < 5) {
            return "";
          } else {
            return `${percentageValue}%`;
          }
        },
      },
    },
    animation: {
      duration: 0,
    },
  },
});

// Doughnut Chart : 이용자 성별
const genderCanvas = document.getElementById("genderChart");
const maleLabel = document.getElementById("maleLabel");
const femaleLabel = document.getElementById("femaleLabel");

function createGenderChart(canvasEl, labels, data, colors) {
  return new Chart(canvasEl, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: colors,
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "80%",
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
        datalabels: {
          display: false,
        },
      },
      animation: {
        duration: 0,
      },
    },
  });
}

// chart-label 요소 포지션
function updateLabelPositions(chart, labels) {
  const chartArea = chart.chartArea;
  if (!chartArea) return;

  const centerX = (chartArea.left + chartArea.right) / 2;
  const centerY = (chartArea.top + chartArea.bottom) / 2;
  const radius = (chartArea.right - chartArea.left) / 2;

  const totalValue = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
  const angles = chart.data.datasets[0].data.map((value, index) => {
    const startAngle = index === 0 ? 0 : (chart.data.datasets[0].data.slice(0, index).reduce((a, b) => a + b, 0) / totalValue) * 360;
    const endAngle = startAngle + (value / totalValue) * 360;
    return { start: startAngle, end: endAngle };
  });

  labels.forEach((label, index) => {
    const angle = (angles[index].start + angles[index].end) / 2;
    const radian = (angle - 90) * (Math.PI / 180);

    const x = centerX + Math.cos(radian) * (radius * 0.85);
    const y = centerY + Math.sin(radian) * (radius * 0.85);

    label.style.left = `${x - 16}px`;
    label.style.top = `${y - 16}px`;
  });
}

// 차트 생성 및 레이블 위치 조정
const genderChart = createGenderChart(genderCanvas, ["남", "여"], [130, 245], ["#0066ff", "#E04EC7"]);

// 초기 레이블 위치 조정
updateLabelPositions(genderChart, [maleLabel, femaleLabel]);

// 리사이즈 이벤트 리스너
window.addEventListener("resize", () => {
  updateLabelPositions(genderChart, [maleLabel, femaleLabel]);
});
