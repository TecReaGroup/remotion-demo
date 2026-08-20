# Primer Segment Tree Visualizer

使用 Remotion 制作的线段树教学动画。界面依据 `primer-design.md` 重构，采用 Primer 风格的颜色、字体、间距、圆角、边框和状态表达。

## Structure

- `src/design-system.ts`：Primer 风格设计 tokens
- `src/segment-tree/model.ts`：线段树数据、查询步骤和时间轴常量
- `src/segment-tree/timeline.ts`：逐帧状态计算
- `src/segment-tree/components.tsx`：标题栏、树画布、代码面板和信息卡片
- `src/SegmentTree.tsx`：Composition 场景装配

## Commands

**Install dependencies**

```console
npm i
```

**Start preview**

```console
npm run dev
```

**Render video**

```console
npx remotion render SegmentTree out/segment-tree.mp4
```

**Validate**

```console
npm run lint
npm run build
```

视频规格：`1920 × 1080`、`30fps`，Composition ID 为 `SegmentTree`。
