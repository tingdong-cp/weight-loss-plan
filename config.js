// ─── PLAN OVERVIEW ───────────────────────────────────────────────
export const planConfig = {
    title: '12周减重计划',
    subtitle: '稳健、可持续的进度 — 每周约减重0.5公斤',
    currentWeek: 3,
    totalWeeks: 12,
};

// ─── WEIGHT & CALORIE STATS ──────────────────────────────────────
export const stats = [
    { label: '起始体重', value: '122 斤' },
    { label: '当前体重', value: '122 斤' },
    { label: '目标体重', value: '93.0 公斤' },
    { label: '每日热量', value: '1,750 千卡' },
];

// ─── PROGRESS ────────────────────────────────────────────────────
export const progress = {
    lost: '1.4 公斤',
    remaining: '4.1 公斤',
    percentage: 25,         // 0–100
};

// ─── WEEKLY SCHEDULE ─────────────────────────────────────────────
export const schedule = [
    { day: '周一', type: '有氧运动 30分钟', tag: 'cardio' },
    { day: '周二', type: '力量训练', tag: 'strength' },
    { day: '周三', type: '休息 / 散步', tag: 'rest' },
    { day: '周四', type: '有氧运动 30分钟', tag: 'cardio' },
    { day: '周五', type: '力量训练', tag: 'strength' },
    { day: '周六', type: '长距离步行 / 远足', tag: 'cardio' },
    { day: '周日', type: '完全休息', tag: 'rest' },
];

// ─── NUTRITION TARGETS ───────────────────────────────────────────
// pct = how full the bar looks (0–100), not a calculated value
export const nutrition = [
    { label: '蛋白质', value: '140g', pct: 72, color: '#534AB7' },
    { label: '碳水化合物', value: '175g', pct: 55, color: '#1D9E75' },
    { label: '脂肪', value: '58g', pct: 38, color: '#BA7517' },
    { label: '膳食纤维', value: '28g', pct: 45, color: '#378ADD' },
    { label: '饮水量', value: '8杯', pct: 60, color: '#5DCAA5' },
];

// ─── PHASES ──────────────────────────────────────────────────────
export const phases = [
    { label: '第一阶段', weeks: '第1–4周', desc: '建立习惯，记录饮食，每周锻炼3次', color: '#1D9E75', dark: '#0F6E56' },
    { label: '第二阶段', weeks: '第5–8周', desc: '提升强度，增加力量训练，减少糖分', color: '#534AB7', dark: '#534AB7' },
    { label: '第三阶段', weeks: '第9–12周', desc: '优化状态，保持动力，复盘成果', color: '#B4B2A9', dark: '#888780' },
];

// ─── WEEKLY TIPS ─────────────────────────────────────────────────
export const tips = [
    { color: '#1D9E75', text: '每餐都摄入蛋白质，有助于在减脂的同时保留肌肉。' },
    { color: '#534AB7', text: '保证每晚7–9小时睡眠——睡眠不足会升高饥饿素水平。' },
    { color: '#378ADD', text: '每餐前喝一杯水，有助于自然减少进食量。' },
    { color: '#BA7517', text: '每周在同一时间称重一次，保持数据的一致性。' },
];
