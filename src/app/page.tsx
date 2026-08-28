"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

type OfferStatus = "Needs attention" | "On track" | "Top performer";
type OfferType = "Bundle deal" | "Cashback" | "Discount" | "Accessory add-on";
type PlacementName =
  | "Order Confirmation"
  | "Tracking Page"
  | "Post-purchase Recommendation";
type Range = "7 days" | "30 days" | "90 days";
type Tone = "positive" | "negative" | "neutral" | "warning";
type ChartAnnotation = { index: number; label: string };
type SortDirection = "asc" | "desc";
type OfferFilter = OfferStatus | "All";
type ProductState = "default" | "loading" | "claimed" | "error" | "empty";
type TrendPeriod = {
  values: number[];
  labels: string[];
  startLabel: string;
  endLabel: string;
  change: number;
  summary: string;
  recommendation?: string;
  annotations: ChartAnnotation[];
};

type Offer = {
  id: string;
  name: string;
  subtitle: string;
  proposition: string;
  trigger: string;
  triggerProduct: string;
  type: OfferType;
  productImage: string;
  productImageAlt: string;
  status: OfferStatus;
  severity: "High" | "Medium" | "Low";
  impressionsLabel: string;
  ctrLabel: string;
  ctrChange: number;
  claimRateLabel: string;
  claimRateChange: number;
  revenueLabel: string;
  revenueChange: number;
  impressionsChange: number;
  attention: string;
  primaryPlacement: PlacementName;
  activePlacements: PlacementName[];
};

type PlacementPerformance = {
  name: PlacementName;
  impressions: string;
  ctr: string;
  previousCtr: string;
  ctrChange: number;
  claimRate: string;
  emphasized?: boolean;
  deviceBreakdown?: Array<{ device: string; ctr: string }>;
};

type DevicePerformance = {
  device: "Mobile" | "Desktop";
  share: string;
  impressions: string;
  ctr: string;
  ctrChange: number;
  claimRate: string;
};

type OfferInvestigation = {
  trend: number[];
  trendStart: string;
  trendEnd: string;
  trendChange: number;
  trendSummary: string;
  timelineAnnotations: ChartAnnotation[];
  trendRanges?: Record<Range, TrendPeriod>;
  placements: PlacementPerformance[];
  placementInsight: string;
  placementRecommendation: string;
  devices: DevicePerformance[];
  deviceInsight: string;
  deviceRecommendation: string;
  recommendation: {
    title: string;
    body: string;
    primaryPlacement: PlacementName;
  };
};

const portfolio = {
  impressions: "2.4M",
  ctr: "3.1%",
  claimRate: "11%",
  revenue: "$18.2K",
  revenueFull: "$18,200",
  averageCashback: "$2.40",
  topOfferType: "Cashback",
  bottomOfferType: "Bundle deals",
  bundleCtr: "1.8%",
  mobileSplit: "74%",
  desktopSplit: "26%",
  timeToClaim: "3.8 days",
};

const ranges: Range[] = ["7 days", "30 days", "90 days"];
const productStates: ProductState[] = ["default", "loading", "claimed", "error", "empty"];
const productStateLabels: Record<ProductState, string> = {
  default: "Default",
  loading: "Loading",
  claimed: "Claimed",
  error: "Error",
  empty: "Empty",
};
const chartPeriodLabels: Record<Range, string[]> = {
  "7 days": ["Aug 22", "Aug 23", "Aug 24", "Aug 25", "Aug 26", "Aug 27", "Today"],
  "30 days": ["Jul 28", "Aug 2", "Aug 7", "Aug 12", "Aug 17", "Aug 22", "Today"],
  "90 days": ["May 30", "Jun 14", "Jun 29", "Jul 14", "Jul 29", "Aug 13", "Today"],
};
const chartPeriods = chartPeriodLabels["30 days"];
const placementOptions: PlacementName[] = [
  "Order Confirmation",
  "Tracking Page",
  "Post-purchase Recommendation",
];

const nikeProductImages = {
  runningSocks:
    "https://static.nike.com/a/images/t_PDP_144_v1/f_auto%2Cq_auto%3Aeco%2Cu_9ddf04c7-2a9a-4d76-add1-d15af8f0263d%2Cc_scale%2Cfl_relative%2Cw_1.0%2Ch_1.0%2Cfl_layer_apply/9c14729c-752b-4dde-8530-3241e0fa1b94/U%2BNK%2BLTWT%2BRUN%2BCREW%2B1PR%2B-%2B200.png",
  runningBelt:
    "https://static.nike.com/a/images/t_default/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/09f05daa-f8c8-466b-bb56-f30f75ac1306/NK+RUN+BELT.png",
  insoles:
    "https://static.nike.com/a/images/f_auto/dpr_1.0,cs_srgb/h_2432,c_limit/4f24f132-6752-4dfe-afff-3319367d2d43/how-to-choose-arch-support-inserts-according-to-podiatrists.jpg",
  trainingShorts:
    "https://static.nike.com/a/images/t_default/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/fd9ff98f-d59b-4f92-ba88-d592785b3e79/AS+M+NP+DF+NPT+6IN+SHORT.png",
  sportsBra:
    "https://static.nike.com/a/images/t_default/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/6ee2db17-1ef9-46d9-b663-6c39f11577f6/W+NK+SWSH+MED+SPT+BRA.png",
  footballSocks:
    "https://static.nike.com/a/images/t_PDP_144_v1/f_auto%2Cq_auto%3Aeco%2Cu_9ddf04c7-2a9a-4d76-add1-d15af8f0263d%2Cc_scale%2Cfl_relative%2Cw_1.0%2Ch_1.0%2Cfl_layer_apply/e2e068a2-b3a9-4e45-aadf-a8d8631b07db/U%2BNK%2BSTRIKE%2BKH%2B-%2BWC22%2BTEAM.png",
  duffel:
    "https://static.nike.com/a/images/t_default/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/eb596e9e-ebd9-442f-bc8c-6092b12f51fe/NK+BRSLA+L+DUFF+-+X.png",
  runningCap:
    "https://static.nike.com/a/images/t_default/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/32c48e44-45bc-4e39-a974-053bd3e05dca/U+NK+DF+PRO+CAP+US+FB+RN+GFX.png",
};

const offers: Offer[] = [
  {
    id: "running-essentials-bundle",
    name: "Nike Running Essentials Bundle",
    subtitle: "Bundle deal",
    proposition: "20% off after Pegasus running shoe purchase",
    trigger: "Pegasus running shoe purchase",
    triggerProduct: "Pegasus 41",
    type: "Bundle deal",
    productImage: nikeProductImages.runningSocks,
    productImageAlt: "Nike running socks product image",
    status: "Needs attention",
    severity: "High",
    impressionsLabel: "360K",
    ctrLabel: portfolio.bundleCtr,
    ctrChange: -0.8,
    claimRateLabel: "8.2%",
    claimRateChange: -0.9,
    revenueLabel: "$1.7K/mo",
    revenueChange: -10,
    impressionsChange: 2,
    attention:
      "Bundle deals are currently the lowest-performing offer type, with a 1.8% CTR.",
    primaryPlacement: "Tracking Page",
    activePlacements: [
      "Tracking Page",
      "Order Confirmation",
      "Post-purchase Recommendation",
    ],
  },
  {
    id: "cashback-running-belt",
    name: "Running Belt Cashback",
    subtitle: `${portfolio.averageCashback} average cashback`,
    proposition: `${portfolio.averageCashback} cashback after running shoe purchase`,
    trigger: "Running shoe purchase",
    triggerProduct: "Nike running shoes",
    type: "Cashback",
    productImage: nikeProductImages.runningBelt,
    productImageAlt: "Nike running belt product image",
    status: "Top performer",
    severity: "Low",
    impressionsLabel: "330K",
    ctrLabel: "4.2%",
    ctrChange: 0.6,
    claimRateLabel: "12.8%",
    claimRateChange: 0.4,
    revenueLabel: "$3.2K/mo",
    revenueChange: 8,
    impressionsChange: 5,
    attention:
      "Cashback is currently the strongest-performing offer type.",
    primaryPlacement: "Order Confirmation",
    activePlacements: ["Order Confirmation", "Post-purchase Recommendation"],
  },
  {
    id: "performance-insoles",
    name: "Performance Insoles",
    subtitle: "10% off",
    proposition: "10% off after Pegasus or Vomero purchase",
    trigger: "Pegasus or Vomero purchase",
    triggerProduct: "Pegasus or Vomero",
    type: "Accessory add-on",
    productImage: nikeProductImages.insoles,
    productImageAlt: "Nike arch support insert product image",
    status: "On track",
    severity: "Low",
    impressionsLabel: "260K",
    ctrLabel: "2.9%",
    ctrChange: -0.1,
    claimRateLabel: "10.4%",
    claimRateChange: -0.2,
    revenueLabel: "$1.8K/mo",
    revenueChange: 2,
    impressionsChange: 1,
    attention: "Performance is currently stable.",
    primaryPlacement: "Post-purchase Recommendation",
    activePlacements: ["Post-purchase Recommendation", "Tracking Page"],
  },
  {
    id: "training-shorts-cashback",
    name: "Training Shorts Cashback",
    subtitle: `${portfolio.averageCashback} average cashback`,
    proposition: `${portfolio.averageCashback} cashback after training top purchase`,
    trigger: "Training top purchase",
    triggerProduct: "Nike training top",
    type: "Cashback",
    productImage: nikeProductImages.trainingShorts,
    productImageAlt: "Nike training shorts product image",
    status: "Top performer",
    severity: "Low",
    impressionsLabel: "310K",
    ctrLabel: "4.0%",
    ctrChange: 0.4,
    claimRateLabel: "12.1%",
    claimRateChange: 0.3,
    revenueLabel: "$2.8K/mo",
    revenueChange: 6,
    impressionsChange: 4,
    attention: "Cashback is currently the strongest-performing offer type.",
    primaryPlacement: "Tracking Page",
    activePlacements: ["Tracking Page", "Order Confirmation"],
  },
  {
    id: "sports-bra-discount",
    name: "Sports Bra Discount",
    subtitle: "15% off",
    proposition: "15% off after women's training apparel purchase",
    trigger: "Women's training apparel purchase",
    triggerProduct: "Women's training apparel",
    type: "Discount",
    productImage: nikeProductImages.sportsBra,
    productImageAlt: "Nike sports bra product image",
    status: "On track",
    severity: "Low",
    impressionsLabel: "280K",
    ctrLabel: "3.0%",
    ctrChange: 0.1,
    claimRateLabel: "10.7%",
    claimRateChange: 0.1,
    revenueLabel: "$2.0K/mo",
    revenueChange: 3,
    impressionsChange: 2,
    attention: "Performance is currently stable.",
    primaryPlacement: "Order Confirmation",
    activePlacements: ["Order Confirmation", "Post-purchase Recommendation"],
  },
  {
    id: "football-socks-bundle",
    name: "Football Socks Bundle",
    subtitle: "Bundle deal",
    proposition: "15% off after football boot purchase",
    trigger: "Football boot purchase",
    triggerProduct: "Nike football boots",
    type: "Bundle deal",
    productImage: nikeProductImages.footballSocks,
    productImageAlt: "Nike football socks product image",
    status: "Needs attention",
    severity: "Medium",
    impressionsLabel: "300K",
    ctrLabel: portfolio.bundleCtr,
    ctrChange: -0.8,
    claimRateLabel: "7.4%",
    claimRateChange: -0.8,
    revenueLabel: "$1.3K/mo",
    revenueChange: -8,
    impressionsChange: 1,
    attention:
      "This offer belongs to the lowest-performing offer type and receives significant exposure on the Tracking Page.",
    primaryPlacement: "Tracking Page",
    activePlacements: ["Tracking Page", "Order Confirmation"],
  },
  {
    id: "gym-duffel-cashback",
    name: "Gym Duffel Bag Cashback",
    subtitle: `${portfolio.averageCashback} average cashback`,
    proposition: `${portfolio.averageCashback} cashback after training shoe purchase`,
    trigger: "Training shoe purchase",
    triggerProduct: "Nike training shoes",
    type: "Cashback",
    productImage: nikeProductImages.duffel,
    productImageAlt: "Nike gym duffel bag product image",
    status: "Top performer",
    severity: "Low",
    impressionsLabel: "320K",
    ctrLabel: "4.4%",
    ctrChange: 0.7,
    claimRateLabel: "13.2%",
    claimRateChange: 0.5,
    revenueLabel: "$3.0K/mo",
    revenueChange: 7,
    impressionsChange: 4,
    attention:
      "Cashback is currently the strongest-performing offer type.",
    primaryPlacement: "Order Confirmation",
    activePlacements: ["Order Confirmation", "Tracking Page"],
  },
  {
    id: "running-cap-discount",
    name: "Running Cap Discount",
    subtitle: "10% off",
    proposition: "10% off after running apparel purchase",
    trigger: "Running apparel purchase",
    triggerProduct: "Nike running apparel",
    type: "Discount",
    productImage: nikeProductImages.runningCap,
    productImageAlt: "Nike running cap product image",
    status: "On track",
    severity: "Low",
    impressionsLabel: "240K",
    ctrLabel: "3.1%",
    ctrChange: 0,
    claimRateLabel: "11.0%",
    claimRateChange: 0,
    revenueLabel: "$2.4K/mo",
    revenueChange: 1,
    impressionsChange: 0,
    attention: "Performance is currently stable.",
    primaryPlacement: "Post-purchase Recommendation",
    activePlacements: ["Post-purchase Recommendation", "Tracking Page"],
  },
];

const attentionOffers = offers.filter((offer) => offer.status === "Needs attention");

const defaultTrendAnnotations: ChartAnnotation[] = [
  { index: 2, label: "Aug 7 Tracking Page exposure increased" },
  { index: 3, label: "Aug 12 Offer creative updated" },
  { index: 4, label: "Aug 17 CTR begins declining" },
];

const runningEssentialsTrendRanges: Record<Range, TrendPeriod> = {
  "7 days": {
    values: [2.05, 2.0, 1.95, 1.9, 1.86, 1.82, 1.8],
    labels: chartPeriodLabels["7 days"],
    startLabel: "2.1%",
    endLabel: "1.8%",
    change: -0.3,
    summary:
      "CTR continued to soften over the last 7 days, moving from 2.1% to 1.8%. The recent movement keeps Tracking Page context worth reviewing.",
    recommendation:
      "Try a short placement test that reduces Tracking Page exposure and moves more impressions toward a higher-intent surface. Other brands often test placement before changing the offer value.",
    annotations: [{ index: 1, label: "Aug 23 CTR drops below 2.0%" }],
  },
  "30 days": {
    values: [2.6, 2.5, 2.5, 2.3, 2.1, 1.9, 1.8],
    labels: chartPeriodLabels["30 days"],
    startLabel: "2.6%",
    endLabel: "1.8%",
    change: -0.8,
    summary:
      "CTR was relatively stable during the first half of the month before declining to 1.8%. The decline coincides with increased Tracking Page exposure, making that surface worth investigating.",
    recommendation:
      "Try changing the placement mix first: shift a small share of exposure away from Tracking Page and compare against Order Confirmation. Similar brands often use this kind of placement split before revising creative.",
    annotations: defaultTrendAnnotations,
  },
  "90 days": {
    values: [3.0, 2.9, 2.8, 2.6, 2.3, 2.0, 1.8],
    labels: chartPeriodLabels["90 days"],
    startLabel: "3.0%",
    endLabel: "1.8%",
    change: -1.2,
    summary:
      "CTR has moved down over the 90-day view, with the sharper decline appearing in the most recent third of the period.",
    recommendation:
      "Review whether Tracking Page has accumulated too much low-intent exposure over time. Other brands often rebalance declining bundle offers toward confirmation or post-purchase moments before changing discount depth.",
    annotations: [
      { index: 3, label: "Jul 14 Placement mix changed" },
      { index: 4, label: "Jul 29 Tracking Page exposure increased" },
      { index: 5, label: "Aug 13 CTR decline steepens" },
    ],
  },
};

const runningBeltTrendRanges: Record<Range, TrendPeriod> = {
  "7 days": {
    values: [4.0, 4.05, 4.08, 4.12, 4.15, 4.18, 4.2],
    labels: chartPeriodLabels["7 days"],
    startLabel: "4.0%",
    endLabel: "4.2%",
    change: 0.2,
    summary:
      "CTR improved modestly over the last 7 days, ending at 4.2%. Order Confirmation remains the strongest visible placement signal.",
    recommendation:
      "Keep Order Confirmation as the primary surface and test incremental expansion from there. Other brands often scale the placement that is already lifting before trying new surfaces.",
    annotations: [{ index: 5, label: "Aug 27 CTR reaches 4.2%" }],
  },
  "30 days": {
    values: [3.6, 3.7, 3.75, 3.85, 4.0, 4.1, 4.2],
    labels: chartPeriodLabels["30 days"],
    startLabel: "3.6%",
    endLabel: "4.2%",
    change: 0.6,
    summary:
      "CTR improved from 3.6% to 4.2% over the last 30 days, with the largest lift coming from Order Confirmation.",
    recommendation:
      "Try preserving the current Order Confirmation placement and use it as the benchmark for any new placement test. Other brands often expand cashback offers from high-intent confirmation moments first.",
    annotations: [
      { index: 2, label: "Aug 7 Order Confirmation exposure increased" },
      { index: 3, label: "Aug 12 Cashback creative updated" },
      { index: 5, label: "Aug 22 CTR reaches 4.1%" },
    ],
  },
  "90 days": {
    values: [3.3, 3.35, 3.5, 3.65, 3.8, 4.05, 4.2],
    labels: chartPeriodLabels["90 days"],
    startLabel: "3.3%",
    endLabel: "4.2%",
    change: 0.9,
    summary:
      "CTR improved across the 90-day view, with the strongest gains occurring after Order Confirmation exposure increased.",
    recommendation:
      "Use the Order Confirmation pattern as the control when testing other placements. Similar brands often scale proven high-intent surfaces gradually instead of moving all traffic at once.",
    annotations: [
      { index: 3, label: "Jul 14 Order Confirmation exposure increased" },
      { index: 4, label: "Jul 29 Cashback creative updated" },
      { index: 5, label: "Aug 13 CTR reaches 4.1%" },
    ],
  },
};

const runningEssentialsInvestigation: OfferInvestigation = {
  trend: [2.6, 2.5, 2.5, 2.3, 2.1, 1.9, 1.8],
  trendStart: "2.6%",
  trendEnd: "1.8%",
  trendChange: -0.8,
  trendSummary:
    "CTR remained relatively stable during the first half of the month before declining from 2.3% to 1.8%. The decline coincides with increased Tracking Page exposure, making that surface worth investigating.",
  timelineAnnotations: defaultTrendAnnotations,
  trendRanges: runningEssentialsTrendRanges,
  placementInsight:
    "Most of the CTR decline is concentrated on the Tracking Page, while the other placements remain relatively stable.",
  placementRecommendation:
    "Try changing the placement mix by reducing Tracking Page exposure and testing more impressions on Order Confirmation. Other brands often use higher-intent surfaces to validate bundle offers before changing the offer itself.",
  placements: [
    {
      name: "Tracking Page",
      impressions: "220K",
      ctr: "1.4%",
      previousCtr: "2.5%",
      ctrChange: -1.1,
      claimRate: "6.9%",
      emphasized: true,
      deviceBreakdown: [
        { device: "Mobile", ctr: "1.2%" },
        { device: "Desktop", ctr: "2.1%" },
      ],
    },
    {
      name: "Order Confirmation",
      impressions: "90K",
      ctr: "2.5%",
      previousCtr: "2.6%",
      ctrChange: -0.1,
      claimRate: "10.2%",
    },
    {
      name: "Post-purchase Recommendation",
      impressions: "50K",
      ctr: "2.3%",
      previousCtr: "2.5%",
      ctrChange: -0.2,
      claimRate: "10.1%",
    },
  ],
  devices: [
    {
      device: "Mobile",
      share: portfolio.mobileSplit,
      impressions: "266K",
      ctr: "1.5%",
      ctrChange: -0.9,
      claimRate: "7.5%",
    },
    {
      device: "Desktop",
      share: portfolio.desktopSplit,
      impressions: "94K",
      ctr: "2.65%",
      ctrChange: -0.1,
      claimRate: "10.2%",
    },
  ],
  deviceInsight:
    "Mobile accounts for most of this offer's exposure and is also showing the larger CTR decline. Desktop performance has remained relatively stable.",
  deviceRecommendation:
    "Try reviewing the mobile Tracking Page placement first: shorten the offer copy, move the value closer to the product context, and compare against desktop. Other brands often optimize mobile placement density before changing incentives.",
  recommendation: {
    title: "Review mobile Tracking Page experience",
    body: "Tracking Page shows the largest CTR decline at 1.1 pp. Mobile represents most of this offer's exposure and is also underperforming desktop at 1.5% CTR versus 2.65%. Start by reviewing how the bundle proposition is presented on the mobile Tracking Page before changing the overall offer.",
    primaryPlacement: "Tracking Page",
  },
};

const runningBeltInvestigation: OfferInvestigation = {
  trend: [3.6, 3.7, 3.75, 3.85, 4.0, 4.1, 4.2],
  trendStart: "3.6%",
  trendEnd: "4.2%",
  trendChange: 0.6,
  trendSummary:
    "CTR improved from 3.6% to 4.2% over the last 30 days, with the largest lift coming from Order Confirmation.",
  timelineAnnotations: [
    { index: 2, label: "Aug 7 Order Confirmation exposure increased" },
    { index: 3, label: "Aug 12 Cashback creative updated" },
    { index: 5, label: "Aug 22 CTR reaches 4.1%" },
  ],
  trendRanges: runningBeltTrendRanges,
  placementInsight:
    "Order Confirmation accounts for most of the improvement, while Post-purchase Recommendation remains relatively stable.",
  placementRecommendation:
    "Try using Order Confirmation as the control placement and test smaller expansions from there. Other brands often scale cashback offers from the placement that is already showing the strongest lift.",
  placements: [
    {
      name: "Order Confirmation",
      impressions: "230K",
      ctr: "4.35%",
      previousCtr: "3.65%",
      ctrChange: 0.7,
      claimRate: "13.4%",
      emphasized: true,
      deviceBreakdown: [
        { device: "Mobile", ctr: "4.1%" },
        { device: "Desktop", ctr: "4.8%" },
      ],
    },
    {
      name: "Post-purchase Recommendation",
      impressions: "100K",
      ctr: "3.85%",
      previousCtr: "3.75%",
      ctrChange: 0.1,
      claimRate: "11.4%",
    },
  ],
  devices: [
    {
      device: "Mobile",
      share: portfolio.mobileSplit,
      impressions: "244K",
      ctr: "4.0%",
      ctrChange: 0.3,
      claimRate: "12.4%",
    },
    {
      device: "Desktop",
      share: portfolio.desktopSplit,
      impressions: "86K",
      ctr: "4.6%",
      ctrChange: 0.1,
      claimRate: "13.9%",
    },
  ],
  deviceInsight:
    "Mobile accounts for 74% of exposure and currently trails desktop CTR, although it improved more over the selected period.",
  deviceRecommendation:
    "Try adapting the mobile treatment toward the desktop pattern while keeping the cashback value prominent. Other brands often bring the reward amount earlier in mobile copy and reduce competing content around the CTA.",
  recommendation: {
    title: "Review Order Confirmation experience",
    body: "Order Confirmation accounts for most of this offer's improvement. Review that surface first to understand what is working before expanding changes elsewhere.",
    primaryPlacement: "Order Confirmation",
  },
};

function investigationFor(offer: Offer): OfferInvestigation {
  if (offer.id === "running-essentials-bundle") {
    return runningEssentialsInvestigation;
  }

  if (offer.id === "cashback-running-belt") {
    return runningBeltInvestigation;
  }

  const currentCtr = percentToNumber(offer.ctrLabel);
  const previousCtr = Math.max(0.1, currentCtr - offer.ctrChange);
  const totalImpressions = numberLabelToThousands(offer.impressionsLabel);
  const isWeakening = offer.ctrChange < -0.15;
  const isImproving = offer.ctrChange > 0.15;
  const directionText = isWeakening
    ? "declined"
    : isImproving
      ? "increased"
      : "held steady";
  const trend = buildTrend(previousCtr, currentCtr, offer.ctrChange);
  const placements = offer.activePlacements.map((name, index) => {
    const isPrimary = name === offer.primaryPlacement;
    const impressionShare = index === 0 ? 0.6 : index === 1 ? 0.25 : 0.15;
    const placementCtr = isPrimary
      ? currentCtr
      : Math.max(0.1, currentCtr + (isImproving ? -0.2 : 0.35 - index * 0.15));
    const placementChange = isPrimary
      ? offer.ctrChange
      : isWeakening
        ? -0.1
        : isImproving
          ? 0.1
          : 0;

    return {
      name,
      impressions: `${Math.round(totalImpressions * impressionShare)}K`,
      ctr: `${placementCtr.toFixed(1)}%`,
      previousCtr: `${Math.max(0.1, placementCtr - placementChange).toFixed(1)}%`,
      ctrChange: placementChange,
      claimRate: isPrimary ? offer.claimRateLabel : portfolio.claimRate,
      emphasized: isPrimary,
      deviceBreakdown: isPrimary
        ? [
            { device: "Mobile", ctr: `${Math.max(0.1, currentCtr - 0.2).toFixed(1)}%` },
            { device: "Desktop", ctr: `${(currentCtr + 0.4).toFixed(1)}%` },
          ]
        : undefined,
    };
  });

  return {
    trend,
    trendStart: `${previousCtr.toFixed(1)}%`,
    trendEnd: offer.ctrLabel,
    trendChange: offer.ctrChange,
    trendSummary: `${offer.name} ${directionText} over the last 30 days, with the clearest signal on ${offer.primaryPlacement}. Review placement and device performance before changing the offer.`,
    timelineAnnotations: defaultTrendAnnotations,
    placements,
    placementInsight: `The largest movement is concentrated on ${offer.primaryPlacement}, while the other active placements remain comparatively stable.`,
    placementRecommendation: `Try a small placement test on ${offer.primaryPlacement} before changing the offer. Other brands often compare the current placement against a higher-intent surface to confirm where the performance difference is coming from.`,
    devices: [
      {
        device: "Mobile",
        share: portfolio.mobileSplit,
        impressions: `${Math.round(totalImpressions * 0.74)}K`,
        ctr: `${Math.max(0.1, currentCtr - 0.2).toFixed(1)}%`,
        ctrChange: isWeakening ? -0.4 : isImproving ? 0.3 : 0,
        claimRate: offer.claimRateLabel,
      },
      {
        device: "Desktop",
        share: portfolio.desktopSplit,
        impressions: `${Math.round(totalImpressions * 0.26)}K`,
        ctr: `${(currentCtr + 0.4).toFixed(1)}%`,
        ctrChange: isWeakening ? -0.1 : isImproving ? 0.1 : 0,
        claimRate: portfolio.claimRate,
      },
    ],
    deviceInsight: `Mobile represents most exposure for this offer. Compare mobile and desktop results to decide whether ${offer.primaryPlacement} needs a placement-specific review.`,
    deviceRecommendation: `Try reviewing the mobile version of ${offer.primaryPlacement} first, then compare it with desktop. Other brands often simplify mobile offer copy and move the value closer to the CTA before changing incentives.`,
    recommendation: {
      title: `Review ${offer.primaryPlacement} experience`,
      body: `${offer.primaryPlacement} has the clearest movement for this offer. Start by checking whether the proposition is clear on that surface before changing the overall offer.`,
      primaryPlacement: offer.primaryPlacement,
    },
  };
}

export default function Home() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<OfferFilter>("All");
  const [placementFilter, setPlacementFilter] = useState<PlacementName | "All">("All");
  const [range, setRange] = useState<Range>("30 days");
  const [query, setQuery] = useState("");
  const [ctrChangeSort, setCtrChangeSort] = useState<SortDirection | null>(null);
  const [reviewPlacement, setReviewPlacement] = useState<PlacementPerformance | null>(null);
  const [productState, setProductState] = useState<ProductState>("default");

  const selectedOffer = useMemo(
    () => offers.find((offer) => offer.id === selectedOfferId) ?? offers[0],
    [selectedOfferId],
  );

  const filteredOffers = useMemo(() => {
    const visibleOffers = offers.filter((offer) => {
      const matchesStatus = statusFilter === "All" || offer.status === statusFilter;
      const matchesPlacement =
        placementFilter === "All" || offer.primaryPlacement === placementFilter;
      const matchesSearch = `${offer.name} ${offer.subtitle} ${offer.proposition} ${offer.trigger} ${offer.type}`
        .toLowerCase()
        .includes(query.toLowerCase());

      return matchesStatus && matchesPlacement && matchesSearch;
    });

    if (!ctrChangeSort) {
      return visibleOffers;
    }

    return [...visibleOffers].sort((first, second) => {
      return ctrChangeSort === "asc"
        ? first.ctrChange - second.ctrChange
        : second.ctrChange - first.ctrChange;
    });
  }, [ctrChangeSort, placementFilter, query, statusFilter]);

  function openOffer(offerId: string) {
    setSelectedOfferId(offerId);
    setActiveNav("Offers");
    setReviewPlacement(null);
  }

  function openOverview() {
    setActiveNav("Overview");
    setSelectedOfferId(null);
    setReviewPlacement(null);
  }

  function openOffers() {
    setActiveNav("Offers");
    setSelectedOfferId(null);
    setReviewPlacement(null);
  }

  function updateProductState(nextState: ProductState) {
    setProductState(nextState);
    setReviewPlacement(null);

    if (nextState !== "default") {
      setSelectedOfferId(null);
      setActiveNav("Overview");
    }
  }

  const mainContent =
    productState === "loading" ? (
      <LoadingDashboardState />
    ) : productState === "claimed" ? (
      <ClaimedProductState onContinue={() => updateProductState("default")} />
    ) : productState === "error" ? (
      <ErrorProductState onRetry={() => updateProductState("default")} />
    ) : productState === "empty" ? (
      <EmptyProductState onReset={() => updateProductState("default")} />
    ) : selectedOfferId ? (
      <OfferDetail
        offer={selectedOffer}
        range={range}
        setRange={setRange}
        onBack={openOffers}
        onOpenPlacement={setReviewPlacement}
      />
    ) : (
      <Overview
        mode={activeNav === "Offers" ? "offers" : "overview"}
        filteredOffers={filteredOffers}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        placementFilter={placementFilter}
        setPlacementFilter={setPlacementFilter}
        query={query}
        setQuery={setQuery}
        range={range}
        setRange={setRange}
        ctrChangeSort={ctrChangeSort}
        setCtrChangeSort={setCtrChangeSort}
        onOpenOffer={openOffer}
      />
    );

  return (
    <main className="min-h-screen bg-[#fafbfd] text-[#101218]">
      <div className="flex min-h-screen">
        <Sidebar activeNav={activeNav} onSelect={setActiveNav} onOverview={openOverview} />
        <section className="min-w-0 flex-1">
          <TopBar
            activeNav={activeNav}
            productState={productState}
            onOverview={openOverview}
            onOffers={openOffers}
            onProductStateChange={updateProductState}
          />
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-4 py-4 sm:px-6 sm:py-6 lg:gap-6 lg:px-8">
            {mainContent}
          </div>
        </section>
      </div>
      {reviewPlacement ? (
        <PlacementDetailDrawer
          placement={reviewPlacement}
          onClose={() => setReviewPlacement(null)}
          onDecision={() => {
            setReviewPlacement(null);
          }}
        />
      ) : null}
    </main>
  );
}

function Sidebar({
  activeNav,
  onSelect,
  onOverview,
}: {
  activeNav: string;
  onSelect: (value: string) => void;
  onOverview: () => void;
}) {
  const items = ["Overview", "Offers"];

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-[#e5e7eb] bg-white/95 px-4 py-5 backdrop-blur lg:block">
      <button
        className="mb-8 flex w-full items-center gap-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed]"
        onClick={onOverview}
      >
        <span className="flex size-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#7c3aed_0%,#3b82f6_100%)] text-sm font-bold text-white shadow-sm">
          D
        </span>
        <span>
          <span className="block text-sm font-semibold text-[#101218]">Disco</span>
          <span className="block text-xs text-[#6b7280]">Offers</span>
        </span>
      </button>
      <nav aria-label="Primary navigation" className="space-y-1">
        {items.map((item) => (
          <button
            key={item}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
              activeNav === item
                ? "bg-[#f3e8ff] text-[#4c1d95]"
                : "text-[#647084] hover:bg-[#f5f7fa] hover:text-[#101218]"
            }`}
            onClick={() => (item === "Overview" ? onOverview() : onSelect(item))}
          >
            {item}
            {item === "Overview" ? (
              <span className="rounded-full bg-[#ede9fe] px-2 py-0.5 text-xs text-[#7c3aed]">
                2
              </span>
            ) : null}
          </button>
        ))}
      </nav>
    </aside>
  );
}

function TopBar({
  activeNav,
  productState,
  onOverview,
  onOffers,
  onProductStateChange,
}: {
  activeNav: string;
  productState: ProductState;
  onOverview: () => void;
  onOffers: () => void;
  onProductStateChange: (value: ProductState) => void;
}) {
  const items = [
    { label: "Overview", onClick: onOverview },
    { label: "Offers", onClick: onOffers },
  ];

  return (
    <header className="border-b border-[#e5e7eb] bg-white/90 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-[1440px] flex-col justify-center gap-3 px-4 py-3 sm:px-6 lg:min-h-16 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#7c3aed_0%,#3b82f6_100%)] text-xs font-bold text-white shadow-sm lg:hidden">
            D
          </span>
          <h1 className="text-base font-semibold text-[#101218] sm:text-lg">
            Brand performance dashboard
          </h1>
        </div>
        <ProductStateControl
          value={productState}
          onChange={onProductStateChange}
        />
        <nav
          aria-label="Mobile navigation"
          className="grid grid-cols-2 gap-1 rounded-xl border border-[#e5e7eb] bg-[#f5f7fa] p-1 lg:hidden"
        >
          {items.map((item) => (
            <button
              key={item.label}
              className={`h-9 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed] ${
                activeNav === item.label
                  ? "bg-white text-[#7c3aed] shadow-sm"
                  : "text-[#647084] hover:bg-white hover:text-[#101218]"
              }`}
              onClick={item.onClick}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

function ProductStateControl({
  value,
  onChange,
}: {
  value: ProductState;
  onChange: (value: ProductState) => void;
}) {
  return (
    <div className="flex max-w-full items-center gap-2 overflow-x-auto rounded-xl border border-[#e5e7eb] bg-[#f5f7fa] p-1">
      {productStates.map((state) => (
        <button
          key={state}
          className={`h-8 shrink-0 rounded-lg px-2.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed] ${
            value === state
              ? "bg-white text-[#7c3aed] shadow-sm ring-1 ring-[#ddd6fe]"
              : "text-[#647084] hover:bg-white hover:text-[#101218]"
          }`}
          onClick={() => onChange(state)}
        >
          {productStateLabels[state]}
        </button>
      ))}
    </div>
  );
}

function LoadingDashboardState() {
  return (
    <section className="flex flex-col gap-5" aria-busy="true" aria-live="polite">
      <h2 className="sr-only">Loading dashboard</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5">
        <div className="h-5 w-44 rounded-full bg-[#e5e7eb]" />
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          <SkeletonOfferCard />
          <SkeletonOfferCard />
        </div>
      </div>
      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-5 w-32 rounded-full bg-[#e5e7eb]" />
          <div className="h-9 w-full rounded-lg bg-[#e5e7eb] sm:w-56" />
        </div>
        <div className="mt-5 space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-14 rounded-xl bg-[#f5f7fa]" />
          ))}
        </div>
      </div>
    </section>
  );
}

function ClaimedProductState({ onContinue }: { onContinue: () => void }) {
  return (
    <StatePanel
      eyebrow="Claimed"
      title="Offer claim confirmed"
      body="The post-purchase offer has moved into a claimed state. The brand manager can continue monitoring follow-on claim rate, revenue, and device performance from the dashboard."
      tone="success"
      primaryAction="Return to dashboard"
      onPrimaryAction={onContinue}
    />
  );
}

function ErrorProductState({ onRetry }: { onRetry: () => void }) {
  return (
    <StatePanel
      eyebrow="Error"
      title="Offer performance could not load"
      body="The dashboard could not retrieve the latest offer performance data. Keep the existing layout stable and give the user a clear path to retry."
      tone="error"
      primaryAction="Retry"
      onPrimaryAction={onRetry}
    />
  );
}

function EmptyProductState({ onReset }: { onReset: () => void }) {
  return (
    <StatePanel
      eyebrow="Empty"
      title="No offers to review"
      body="There are no active post-purchase offers in this view. The empty state keeps the dashboard useful without showing misleading metrics or blank tables."
      tone="neutral"
      primaryAction="Show default data"
      onPrimaryAction={onReset}
    />
  );
}

function StatePanel({
  eyebrow,
  title,
  body,
  tone,
  primaryAction,
  onPrimaryAction,
}: {
  eyebrow: string;
  title: string;
  body: string;
  tone: "success" | "error" | "neutral";
  primaryAction: string;
  onPrimaryAction: () => void;
}) {
  const toneClass = {
    success: {
      badge: "border-[#bbf7d0] bg-[#ecfdf5] text-[#047857]",
      icon: "bg-[#10b981]",
      ring: "ring-[#bbf7d0]",
      mark: "✓",
    },
    error: {
      badge: "border-[#fecaca] bg-[#fef2f2] text-[#b42318]",
      icon: "bg-[#b42318]",
      ring: "ring-[#fecaca]",
      mark: "!",
    },
    neutral: {
      badge: "border-[#ddd6fe] bg-[#f5f3ff] text-[#7c3aed]",
      icon: "bg-[linear-gradient(135deg,#7c3aed_0%,#3b82f6_100%)]",
      ring: "ring-[#ddd6fe]",
      mark: "0",
    },
  }[tone];

  return (
    <section className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm sm:p-8">
      <div className="mx-auto flex max-w-2xl flex-col items-start gap-5 text-left sm:items-center sm:text-center">
        <span
          className={`flex size-12 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-sm ring-8 ${toneClass.icon} ${toneClass.ring}`}
          aria-hidden="true"
        >
          {toneClass.mark}
        </span>
        <div>
          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClass.badge}`}>
            {eyebrow}
          </span>
          <h2 className="mt-4 text-2xl font-semibold tracking-normal text-[#101218]">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#687080]">{body}</p>
        </div>
        <button
          className="inline-flex h-10 items-center rounded-lg bg-[#111827] px-4 text-sm font-semibold text-white hover:bg-[#2b3442] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed]"
          onClick={onPrimaryAction}
        >
          {primaryAction}
        </button>
      </div>
    </section>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 shadow-sm">
      <div className="h-3 w-20 rounded-full bg-[#e5e7eb]" />
      <div className="mt-3 h-6 w-16 rounded-full bg-[#d1d5db]" />
      <div className="mt-3 h-3 w-28 rounded-full bg-[#eef2f7]" />
    </div>
  );
}

function SkeletonOfferCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-[#e5e7eb] bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="size-14 rounded-lg bg-[#e5e7eb]" />
        <div className="flex-1">
          <div className="h-4 w-3/4 rounded-full bg-[#d1d5db]" />
          <div className="mt-3 h-3 w-full rounded-full bg-[#eef2f7]" />
          <div className="mt-2 h-3 w-2/3 rounded-full bg-[#eef2f7]" />
        </div>
      </div>
      <div className="mt-6 h-9 w-28 rounded-lg bg-[#e5e7eb]" />
    </div>
  );
}

function Overview({
  mode,
  filteredOffers,
  statusFilter,
  setStatusFilter,
  placementFilter,
  setPlacementFilter,
  query,
  setQuery,
  range,
  setRange,
  ctrChangeSort,
  setCtrChangeSort,
  onOpenOffer,
}: {
  mode: "overview" | "offers";
  filteredOffers: Offer[];
  statusFilter: OfferFilter;
  setStatusFilter: (value: OfferFilter) => void;
  placementFilter: PlacementName | "All";
  setPlacementFilter: (value: PlacementName | "All") => void;
  query: string;
  setQuery: (value: string) => void;
  range: Range;
  setRange: (value: Range) => void;
  ctrChangeSort: SortDirection | null;
  setCtrChangeSort: (value: SortDirection | null) => void;
  onOpenOffer: (offerId: string) => void;
}) {
  return (
    <>
      {mode === "overview" ? (
        <section className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium text-[#687080]">Overview</p>
          </div>
          <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-5">
            <KpiSummary
              label="Impressions"
              value={portfolio.impressions}
              change="/ month"
              tone="neutral"
              comparison=""
            />
            <KpiSummary label="CTR" value={portfolio.ctr} change="Current overall CTR" tone="neutral" comparison="" />
            <KpiSummary
              label="Claim rate"
              value={portfolio.claimRate}
              change="Current overall rate"
              tone="neutral"
              comparison=""
            />
            <KpiSummary
              label="Revenue"
              value={portfolio.revenue}
              change="/ month"
              tone="neutral"
              comparison=""
            />
            <KpiSummary
              label="Time to claim"
              value={portfolio.timeToClaim}
              change="avg impression to claim"
              tone="neutral"
              comparison=""
            />
          </div>
        </section>
      ) : null}

      {mode === "overview" ? (
        <>
          <section
            aria-labelledby="attention-heading"
            className="rounded-2xl border border-[#e5e7eb] bg-white p-5"
          >
            <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div>
                <h2 id="attention-heading" className="text-xl font-semibold text-[#101218]">
                  Needs your attention
                </h2>
                <p className="mt-1 text-sm text-[#687080]">
                  Prioritized based on recent performance and offer-level signals.
                </p>
              </div>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              {attentionOffers.map((offer) => (
                <AttentionCard key={offer.id} offer={offer} onInvestigate={onOpenOffer} />
              ))}
            </div>
          </section>

        </>
      ) : null}

      <OfferTable
        offers={filteredOffers}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        placementFilter={placementFilter}
        setPlacementFilter={setPlacementFilter}
        query={query}
        setQuery={setQuery}
        range={range}
        setRange={setRange}
        ctrChangeSort={ctrChangeSort}
        setCtrChangeSort={setCtrChangeSort}
        onOpenOffer={onOpenOffer}
      />
    </>
  );
}

function ProductThumbnail({
  image,
  alt,
  size = "md",
  productName,
}: {
  image?: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  productName: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const sizeClass = {
    sm: "size-11",
    md: "size-14",
    lg: "size-20",
  }[size];
  const imageSize = {
    sm: 44,
    md: 56,
    lg: 80,
  }[size];
  const initials = productName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#dfe2e2] bg-[#f5f7fa]`}
      aria-label={imageFailed || !image ? alt : undefined}
    >
      {image && !imageFailed ? (
        <Image
          src={image}
          alt={alt}
          width={imageSize}
          height={imageSize}
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
          unoptimized
        />
      ) : (
        <span className="text-xs font-semibold text-[#647084]">{initials}</span>
      )}
    </div>
  );
}

function KpiSummary({
  label,
  value,
  change,
  tone,
  comparison = "vs previous period",
}: {
  label: string;
  value: string;
  change: string;
  tone: Tone;
  comparison?: string;
}) {
  const toneClass = {
    positive: "text-[#047857]",
    negative: "text-[#b42318]",
    neutral: "text-[#687080]",
    warning: "text-[#9a6700]",
  }[tone];

  return (
    <div className="min-w-36 w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 shadow-sm">
      <p className="text-xs font-medium text-[#687080]">{label}</p>
      <p className="mt-1 text-xl font-semibold text-[#101218]">{value}</p>
      <p className={`mt-1 text-xs font-medium ${toneClass}`}>
        {change}
        {comparison ? ` ${comparison}` : ""}
      </p>
    </div>
  );
}

function AttentionCard({
  offer,
  onInvestigate,
}: {
  offer: Offer;
  onInvestigate: (offerId: string) => void;
}) {
  return (
    <article
      className="flex min-h-60 cursor-pointer flex-col justify-between rounded-2xl border border-[#dfe2e2] bg-white p-4 shadow-sm transition hover:border-[#ddd6fe] hover:shadow-md"
      role="button"
      tabIndex={0}
      onClick={() => onInvestigate(offer.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onInvestigate(offer.id);
        }
      }}
    >
      <div>
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <ProductThumbnail
              image={offer.productImage}
              alt={offer.productImageAlt}
              productName={offer.name}
              size="md"
            />
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-[#101218]">{offer.name}</h3>
              <p className="mt-1 text-sm text-[#687080]">{offer.proposition}</p>
              <p className="mt-2 text-xs font-medium text-[#647084]">
                {offer.primaryPlacement}
              </p>
            </div>
          </div>
          <SeverityBadge severity={offer.severity} />
        </div>
        <p className="text-lg font-semibold text-[#101218]">CTR {offer.ctrLabel}</p>
        <div className="mt-4 border-l-2 border-[#ddd6fe] pl-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#687080]">
            Why it needs attention
          </p>
          <p className="mt-2 text-sm leading-6 text-[#374151]">{offer.attention}</p>
        </div>
      </div>
      <button
        className="mt-6 w-fit rounded-lg bg-[#111827] px-3 py-2 text-sm font-medium text-white hover:bg-[#2b3442] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed]"
        onClick={(event) => {
          event.stopPropagation();
          onInvestigate(offer.id);
        }}
      >
        View details
      </button>
    </article>
  );
}

function OfferTable({
  offers,
  statusFilter,
  setStatusFilter,
  placementFilter,
  setPlacementFilter,
  query,
  setQuery,
  range,
  setRange,
  ctrChangeSort,
  setCtrChangeSort,
  onOpenOffer,
}: {
  offers: Offer[];
  statusFilter: OfferFilter;
  setStatusFilter: (value: OfferFilter) => void;
  placementFilter: PlacementName | "All";
  setPlacementFilter: (value: PlacementName | "All") => void;
  query: string;
  setQuery: (value: string) => void;
  range: Range;
  setRange: (value: Range) => void;
  ctrChangeSort: SortDirection | null;
  setCtrChangeSort: (value: SortDirection | null) => void;
  onOpenOffer: (offerId: string) => void;
}) {
  const statuses: OfferFilter[] = [
    "All",
    "Needs attention",
    "On track",
    "Top performer",
  ];
  const sortLabel =
    ctrChangeSort === "asc"
      ? "Largest declines first"
      : ctrChangeSort === "desc"
        ? "Largest improvements first"
        : "Sort by CTR change";

  function toggleCtrChangeSort() {
    setCtrChangeSort(
      ctrChangeSort === null ? "asc" : ctrChangeSort === "asc" ? "desc" : null,
    );
  }

  function clearOfferFilters() {
    setStatusFilter("All");
    setPlacementFilter("All");
    setQuery("");
  }

  const hasOffers = offers.length > 0;

  return (
    <section className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white" aria-labelledby="offers-heading">
      <div className="border-b border-[#e5e7e7] p-5">
        <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
          <div>
            <h2 id="offers-heading" className="text-lg font-semibold text-[#101218]">
              All offers
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="offer-search">
              Search offers
            </label>
            <input
              id="offer-search"
              className="h-9 w-full rounded-lg border border-[#d1d5db] bg-white px-3 text-sm outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-[#c4b5fd] sm:w-56"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search offers"
            />
            <Select
              label="Placement"
              value={placementFilter}
              onChange={(value) => setPlacementFilter(value as PlacementName | "All")}
              options={["All", ...placementOptions]}
            />
            <Select
              label="Time range"
              value={range}
              onChange={(value) => setRange(value as Range)}
              options={ranges}
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2" role="list" aria-label="Offer status filters">
          {statuses.map((status) => (
            <button
              key={status}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${
                statusFilter === status
                  ? "border-[#7c3aed] bg-[#ede9fe] text-[#4c1d95]"
                  : "border-[#e5e7eb] text-[#647084] hover:bg-[#fafbfd]"
              }`}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
      {hasOffers ? (
        <>
          <div className="divide-y divide-[#eef2f7] md:hidden">
            {offers.map((offer) => (
              <article
                key={offer.id}
                className="cursor-pointer bg-white p-4 transition hover:bg-[#fafbfd]"
                role="button"
                tabIndex={0}
                onClick={() => onOpenOffer(offer.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onOpenOffer(offer.id);
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  <ProductThumbnail
                    image={offer.productImage}
                    alt={offer.productImageAlt}
                    productName={offer.name}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-sm font-semibold leading-5 text-[#101218]">
                        {offer.name}
                      </h3>
                      <StatusBadge status={offer.status} />
                    </div>
                    <p className="mt-2 text-xs leading-5 text-[#687080]">{offer.proposition}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <MobileMetric label="CTR" value={offer.ctrLabel} />
                  <MobileMetric label="CTR change" value={<CtrChange value={offer.ctrChange} />} />
                  <MobileMetric label="Impressions" value={offer.impressionsLabel} />
                  <MobileMetric label="Revenue" value={offer.revenueLabel} />
                </div>
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#eef2f7] pt-3 text-xs">
                  <span className="min-w-0 truncate text-[#687080]">{offer.primaryPlacement}</span>
                  <span className="shrink-0 font-semibold text-[#7c3aed]">View details</span>
                </div>
              </article>
            ))}
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[980px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#e5e7e7] text-xs uppercase tracking-[0.08em] text-[#687080]">
                  <th className="px-5 py-3 font-semibold">Offer</th>
                  <th className="min-w-40 px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Impressions</th>
                  <th className="px-4 py-3 font-semibold">CTR</th>
                  <th className="px-4 py-3 font-semibold">Claim rate</th>
                  <th className="px-4 py-3 font-semibold">Revenue</th>
                  <th className="px-4 py-3 font-semibold">Placement</th>
                  <th className="px-5 py-3 font-semibold">
                    <button
                      className="group flex flex-col items-start gap-0.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed]"
                      onClick={toggleCtrChangeSort}
                      title="vs previous 30 days"
                      aria-label={`CTR Change, vs previous 30 days. ${sortLabel}`}
                    >
                      <span className="flex items-center gap-1">
                        CTR Change
                        <span className="text-sm leading-none text-[#647084]">
                          {ctrChangeSort === "asc" ? "↓" : ctrChangeSort === "desc" ? "↑" : "↕"}
                        </span>
                      </span>
                      <span className="normal-case tracking-normal text-[#9aa3b2]">
                        vs previous 30 days
                      </span>
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr
                    key={offer.id}
                    className="cursor-pointer border-b border-[#eef2f7] last:border-0 hover:bg-[#fafafa]"
                    tabIndex={0}
                    onClick={() => onOpenOffer(offer.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onOpenOffer(offer.id);
                      }
                    }}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <ProductThumbnail
                          image={offer.productImage}
                          alt={offer.productImageAlt}
                          productName={offer.name}
                          size="sm"
                        />
                        <div className="min-w-0">
                          <button
                            className="text-left font-semibold text-[#101218] hover:text-[#7c3aed] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed]"
                            onClick={(event) => {
                              event.stopPropagation();
                              onOpenOffer(offer.id);
                            }}
                          >
                            {offer.name}
                          </button>
                          <p className="mt-1 text-xs text-[#687080]">{offer.proposition}</p>
                        </div>
                      </div>
                    </td>
                    <td className="min-w-40 px-4 py-4">
                      <StatusBadge status={offer.status} />
                    </td>
                    <td className="px-4 py-4 font-medium text-[#374151]">
                      {offer.impressionsLabel}
                    </td>
                    <td className="px-4 py-4 font-medium text-[#374151]">{offer.ctrLabel}</td>
                    <td className="px-4 py-4 font-medium text-[#374151]">
                      {offer.claimRateLabel}
                    </td>
                    <td className="px-4 py-4 font-medium text-[#374151]">{offer.revenueLabel}</td>
                    <td className="px-4 py-4 text-[#374151]">{offer.primaryPlacement}</td>
                    <td className="px-5 py-4">
                      <CtrChange value={offer.ctrChange} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="px-5 py-10">
          <div className="mx-auto max-w-md text-center">
            <span className="inline-flex rounded-full border border-[#ddd6fe] bg-[#f5f3ff] px-2.5 py-1 text-xs font-semibold text-[#7c3aed]">
              Empty
            </span>
            <h3 className="mt-4 text-xl font-semibold text-[#101218]">No offers match this view</h3>
            <p className="mt-2 text-sm leading-6 text-[#687080]">
              Adjust the filters or search term to return offer performance rows.
            </p>
            <button
              className="mt-5 inline-flex h-10 items-center rounded-lg bg-[#111827] px-4 text-sm font-semibold text-white hover:bg-[#2b3442] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed]"
              onClick={clearOfferFilters}
            >
              Clear filters
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function MobileMetric({
  label,
  value,
}: {
  label: string;
  value: string | ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#eef2f7] bg-[#fafbfd] px-3 py-2">
      <p className="text-[11px] font-medium text-[#687080]">{label}</p>
      <div className="mt-1 font-semibold text-[#101218]">{value}</div>
    </div>
  );
}

function CtrChange({ value }: { value: number }) {
  const direction = value <= -0.15 ? "down" : value >= 0.15 ? "up" : "flat";
  const displayValue = Math.abs(value).toFixed(1);
  const config = {
    down: {
      arrow: "↓",
      className: "text-[#b42318]",
      label: "decreased",
    },
    up: {
      arrow: "↑",
      className: "text-[#047857]",
      label: "increased",
    },
    flat: {
      arrow: "",
      className: "text-[#687080]",
      label: "stable",
    },
  }[direction];

  return (
    <span
      className={`inline-flex min-w-20 items-center gap-1.5 font-semibold ${config.className}`}
      aria-label={`CTR ${config.label} by ${displayValue} percentage points versus previous 30 days`}
      title="vs previous 30 days"
    >
      <span>{displayValue} pp</span>
      {config.arrow ? <span aria-hidden="true">{config.arrow}</span> : null}
    </span>
  );
}

function OfferDetail({
  offer,
  range,
  setRange,
  onBack,
  onOpenPlacement,
}: {
  offer: Offer;
  range: Range;
  setRange: (value: Range) => void;
  onBack: () => void;
  onOpenPlacement: (placement: PlacementPerformance) => void;
}) {
  const investigation = investigationFor(offer);

  return (
    <>
      <OfferDetailHeader offer={offer} onBack={onBack} />
      <CompactOfferMetrics offer={offer} />
      <PerformanceTimeline
        offer={offer}
        investigation={investigation}
        range={range}
        setRange={setRange}
      />
      <PlacementPerformanceTable
        investigation={investigation}
        onOpenPlacement={onOpenPlacement}
      />
      <DevicePerformanceTable investigation={investigation} />
      <AiExplanation />
    </>
  );
}

function CompactOfferMetrics({ offer }: { offer: Offer }) {
  return (
    <section className="grid gap-3 md:grid-cols-4" aria-label="Offer metrics">
      <OfferMetric
          label="CTR"
          value={offer.ctrLabel}
          changeValue={offer.ctrChange}
          changeUnit="pp"
          context={`Overall CTR: ${portfolio.ctr}`}
        />
      <OfferMetric
          label="Claim rate"
          value={offer.claimRateLabel}
          changeValue={offer.claimRateChange}
          changeUnit="pp"
          context={`Overall claim rate: ${portfolio.claimRate}`}
        />
      <OfferMetric
          label="Revenue"
          value={offer.revenueLabel}
          changeValue={offer.revenueChange}
          changeUnit="%"
          precision={0}
          context={`Overall monthly revenue: ${portfolio.revenue}`}
        />
      <OfferMetric
          label="Impressions"
          value={`${offer.impressionsLabel}/mo`}
          changeValue={offer.impressionsChange}
          changeUnit="%"
          precision={0}
          context={`Overall monthly impressions: ${portfolio.impressions}`}
        />
    </section>
  );
}

function OfferMetric({
  label,
  value,
  changeValue,
  changeUnit,
  context,
  precision = 1,
}: {
  label: string;
  value: string;
  changeValue: number;
  changeUnit: "pp" | "%";
  context: string;
  precision?: number;
}) {
  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3">
      <p className="text-xs font-medium text-[#687080]">{label}</p>
      <p className="mt-1 text-xl font-semibold text-[#101218]">{value}</p>
      <MetricChange value={changeValue} unit={changeUnit} precision={precision} />
      <p className="mt-1 text-xs font-medium text-[#9aa3b2]">{context}</p>
    </div>
  );
}

function MetricChange({
  value,
  unit,
  precision,
}: {
  value: number;
  unit: "pp" | "%";
  precision: number;
}) {
  const direction = value <= -0.15 ? "down" : value >= 0.15 ? "up" : "flat";
  const config = {
    down: {
      arrow: "↓",
      className: "text-[#b42318]",
      label: "decreased",
    },
    up: {
      arrow: "↑",
      className: "text-[#047857]",
      label: "increased",
    },
    flat: {
      arrow: "→",
      className: "text-[#687080]",
      label: "stable",
    },
  }[direction];
  const displayValue = Math.abs(value).toFixed(precision);
  const displayAmount = unit === "%" ? `${displayValue}%` : `${displayValue} pp`;

  return (
    <p
      className={`mt-1 text-sm font-semibold ${config.className}`}
      aria-label={`${config.label} by ${displayAmount} versus previous 30 days`}
    >
      {config.arrow} {displayAmount} vs previous 30 days
    </p>
  );
}

function OfferDetailHeader({ offer, onBack }: { offer: Offer; onBack: () => void }) {
  return (
    <section className="flex flex-col gap-4">
      <button
        className="w-fit text-sm font-medium text-[#7c3aed] hover:text-[#4c1d95] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed]"
        onClick={onBack}
      >
        Back to offers
      </button>
      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-start">
          <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
            <ProductThumbnail
              image={offer.productImage}
              alt={offer.productImageAlt}
              productName={offer.name}
              size="lg"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#687080]">Offer details</p>
              <h2 className="mt-1 text-xl font-semibold tracking-normal text-[#101218] sm:text-2xl">
                {offer.name}
              </h2>
              <p className="mt-1 text-base font-medium text-[#374151]">
                {offer.proposition}
              </p>
              <p className="mt-2 text-sm text-[#687080]">
                Triggered by {offer.triggerProduct}
              </p>
            </div>
          </div>
          <div className="flex max-w-xl flex-col items-start gap-3 text-sm">
            <div>
              <p className="mb-2 text-xs font-medium text-[#687080]">Active placements</p>
              <div className="flex flex-wrap gap-2">
                {offer.activePlacements.map((placement) => (
                  <span
                    key={placement}
                    className="rounded-full border border-[#dfe2e2] bg-[#fafbfd] px-2.5 py-1 text-xs font-medium text-[#374151]"
                  >
                    {placement}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PerformanceTimeline({
  offer,
  investigation,
  range,
  setRange,
}: {
  offer: Offer;
  investigation: OfferInvestigation;
  range: Range;
  setRange: (value: Range) => void;
}) {
  const [showEvents, setShowEvents] = useState(true);
  const [isInsightVisible, setIsInsightVisible] = useState(false);
  const [selectedEventIndex, setSelectedEventIndex] = useState<number | null>(null);
  const trend = trendPeriodFor(investigation, range);
  const rangeStartLabel =
    range === "7 days" ? "7 days ago" : range === "90 days" ? "90 days ago" : "30 days ago";

  return (
    <section
      className="rounded-2xl border border-[#d1d5db] bg-white p-5"
      aria-labelledby="performance-over-time-heading"
    >
      <div>
        <h2
          id="performance-over-time-heading"
          className="text-2xl font-semibold text-[#101218]"
        >
          Performance over time
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#687080]">
          {
            "Track how this offer's CTR has changed across the selected period and explore events that may have influenced performance."
          }
        </p>
      </div>

      <div className="mt-5 flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className={`text-lg font-semibold ${changeToneClass(trend.change)}`}>
            {formatChangeLabel(trend.change)} over the last {range}
          </p>
          <div className="mt-3 flex flex-wrap gap-5 text-sm">
            <div>
              <p className="text-xs font-medium text-[#687080]">Current CTR</p>
              <p className="mt-1 font-semibold text-[#101218]">{trend.endLabel}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-[#687080]">{rangeStartLabel}</p>
              <p className="mt-1 font-semibold text-[#101218]">{trend.startLabel}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <SegmentedControl
            label="Range"
            values={ranges}
            active={range}
            onChange={(value) => {
              setSelectedEventIndex(null);
              setIsInsightVisible(false);
              setRange(value as Range);
            }}
          />
          <button
            type="button"
            aria-pressed={showEvents}
            className={`inline-flex h-8 items-center gap-2 rounded-lg border px-2.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed] ${
              showEvents
                ? "border-[#ddd6fe] bg-[#f5f3ff] text-[#7c3aed]"
                : "border-[#e5e7eb] bg-white text-[#687080] hover:bg-[#fafbfd]"
            }`}
            onClick={() => {
              setShowEvents(!showEvents);
              setSelectedEventIndex(null);
            }}
          >
            <span
              className={`flex size-3.5 items-center justify-center rounded-[3px] border text-[10px] leading-none ${
                showEvents
                  ? "border-[#7c3aed] bg-[#7c3aed] text-white"
                  : "border-[#bfc5c5] bg-white"
              }`}
              aria-hidden="true"
            >
              {showEvents ? "✓" : ""}
            </span>
            Show events
          </button>
        </div>
      </div>
      <div className="mt-5 h-[280px] rounded-2xl border border-[#e5e7e7] bg-[#f5f7fa] p-3 sm:h-[320px] sm:p-4">
        <LineChart
          values={trend.values}
          annotation={`${offer.name} CTR trend`}
          annotations={showEvents ? trend.annotations : []}
          labels={trend.labels}
          selectedAnnotationIndex={selectedEventIndex}
          onSelectAnnotation={setSelectedEventIndex}
          currentLabel="CTR"
          valueLabelFormatter={(value) => `${value.toFixed(1)}%`}
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-[#687080]">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[#7c3aed]" />
          CTR data point
        </span>
        {showEvents && trend.annotations.length > 0 ? (
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#93c5fd]" />
            Event marker
          </span>
        ) : null}
      </div>
      <TrendInsightAction
        isVisible={isInsightVisible}
        insight={trend.summary}
        recommendation={
          trend.recommendation ??
          `Try changing placement in a small test before changing the offer. Other brands often validate the highest-intent surface first, then scale the better-performing treatment.`
        }
        events={trend.annotations}
        onShow={() => setIsInsightVisible(true)}
        onDismiss={() => setIsInsightVisible(false)}
        onViewSupportingEvents={() =>
          setSelectedEventIndex(trend.annotations[0]?.index ?? null)
        }
      />
    </section>
  );
}

function TrendInsightAction({
  isVisible,
  insight,
  recommendation,
  events,
  onShow,
  onDismiss,
  onViewSupportingEvents,
}: {
  isVisible: boolean;
  insight: string;
  recommendation: string;
  events: ChartAnnotation[];
  onShow: () => void;
  onDismiss: () => void;
  onViewSupportingEvents: () => void;
}) {
  const [isExplanationVisible, setIsExplanationVisible] = useState(false);

  if (!isVisible) {
    return (
      <div className="mt-4">
        <button
          className="inline-flex h-9 items-center rounded-lg border border-[#ddd6fe] bg-[#f5f3ff] px-3 text-sm font-semibold text-[#7c3aed] hover:border-[#a78bfa] hover:bg-[#ede9fe] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed]"
          onClick={() => {
            setIsExplanationVisible(false);
            onShow();
          }}
        >
          View insight
        </button>
      </div>
    );
  }

  return (
    <div className="relative mt-4 overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-sm">
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#7c3aed_0%,#3b82f6_100%)]" />
      <div className="flex max-w-5xl flex-col gap-3">
        <div>
          <span className="inline-flex rounded-full bg-[#ede9fe] px-2.5 py-1 text-[11px] font-semibold text-[#7c3aed]">
            Insight
          </span>
          <p className="mt-3 text-sm leading-6 text-[#30363a]">{insight}</p>
        </div>
        <div className="rounded-lg bg-[#fafbfd] px-3 py-3">
          <p className="text-xs font-semibold text-[#647084]">Suggested next move</p>
          <p className="mt-1 text-sm leading-6 text-[#374151]">{recommendation}</p>
        </div>
      </div>
      {isExplanationVisible ? (
        <div className="mt-3 rounded-lg border border-[#dfe2e2] bg-[#f5f7fa] px-3 py-2">
          <p className="text-sm leading-6 text-[#647084]">
            The trend compares the selected period start and current CTR, then uses events as
            timeline context. Events mark timing only and do not establish causality.
          </p>
        </div>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          className="inline-flex h-8 items-center rounded-lg bg-[#7c3aed] px-3 text-xs font-semibold text-white hover:bg-[#6d28d9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed]"
          onClick={() => setIsExplanationVisible(true)}
        >
          Ask why
        </button>
        <button
          className="inline-flex h-8 items-center rounded-lg border border-[#ddd6fe] bg-white px-3 text-xs font-semibold text-[#7c3aed] hover:bg-[#f5f3ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed]"
          onClick={onViewSupportingEvents}
          disabled={events.length === 0}
        >
          View supporting events
        </button>
        <button
          className="inline-flex h-8 items-center rounded-lg px-3 text-xs font-semibold text-[#687080] hover:bg-[#fafbfd] hover:text-[#374151] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed]"
          onClick={() => {
            setIsExplanationVisible(false);
            onDismiss();
          }}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

function PlacementPerformanceTable({
  investigation,
  onOpenPlacement,
}: {
  investigation: OfferInvestigation;
  onOpenPlacement: (placement: PlacementPerformance) => void;
}) {
  const [isInsightVisible, setIsInsightVisible] = useState(false);
  const [isSupportingDataVisible, setIsSupportingDataVisible] = useState(false);
  const supportingPlacement = strongestPlacementSignal(investigation.placements);

  return (
    <section
      className="rounded-2xl border border-[#e5e7eb] bg-white"
      aria-labelledby="driver-heading"
    >
      <div className="border-b border-[#e5e7e7] p-5">
        <h2 id="driver-heading" className="text-lg font-semibold text-[#101218]">
          Placement performance
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#687080]">
          Compare current performance across active placements for this offer.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#e5e7e7] text-xs uppercase tracking-[0.08em] text-[#687080]">
              <th className="px-5 py-3 font-semibold">Placement</th>
              <th className="px-4 py-3 font-semibold">Impressions</th>
              <th className="px-4 py-3 font-semibold">CTR</th>
              <th className="px-4 py-3 font-semibold">
                <span className="block">CTR change</span>
                <span className="normal-case tracking-normal text-[#9aa3b2]">
                  vs previous 30 days
                </span>
              </th>
              <th className="px-5 py-3 font-semibold">Claim rate</th>
            </tr>
          </thead>
          <tbody>
            {investigation.placements.map((placement) => (
              <tr
                key={placement.name}
                className={`border-b border-[#eef2f7] last:border-0 ${
                  placement.name === supportingPlacement?.name && isSupportingDataVisible
                    ? "bg-[#f5f3ff]"
                    : placement.emphasized
                      ? "bg-[#fffdf7]"
                      : ""
                }`}
              >
                <td className="px-5 py-4">
                  <button
                    className="font-semibold text-[#101218] hover:text-[#7c3aed] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed]"
                    onClick={() => onOpenPlacement(placement)}
                  >
                    {placement.name}
                  </button>
                </td>
                <td className="px-4 py-4 font-medium text-[#374151]">
                  {placement.impressions}
                </td>
                <td className="px-4 py-4 font-medium text-[#374151]">{placement.ctr}</td>
                <td className="px-4 py-4">
                  <CtrChange value={placement.ctrChange} />
                </td>
                <td className="px-5 py-4 font-medium text-[#374151]">{placement.claimRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <InsightActionArea
        isVisible={isInsightVisible}
        buttonLabel={hasMeaningfulPlacementSignal(investigation.placements) ? "View insight" : "Generate insight"}
        insight={investigation.placementInsight}
        recommendation={investigation.placementRecommendation}
        explanation={placementExplanation(investigation.placements)}
        onShow={() => setIsInsightVisible(true)}
        onDismiss={() => {
          setIsInsightVisible(false);
          setIsSupportingDataVisible(false);
        }}
        onViewSupportingData={() => setIsSupportingDataVisible(true)}
      />
    </section>
  );
}

function DevicePerformanceTable({
  investigation,
}: {
  investigation: OfferInvestigation;
}) {
  const [isInsightVisible, setIsInsightVisible] = useState(false);
  const [isSupportingDataVisible, setIsSupportingDataVisible] = useState(false);
  const supportingDevice = strongestDeviceSignal(investigation.devices);

  return (
    <section
      className="rounded-2xl border border-[#e5e7eb] bg-white"
      aria-labelledby="device-heading"
    >
      <div className="border-b border-[#e5e7e7] p-5">
        <h2 id="device-heading" className="text-lg font-semibold text-[#101218]">
          Device performance
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#687080]">
          Compare exposure and performance across mobile and desktop.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#e5e7e7] text-xs uppercase tracking-[0.08em] text-[#687080]">
              <th className="px-5 py-3 font-semibold">Device</th>
              <th className="px-4 py-3 font-semibold">Impression share</th>
              <th className="px-4 py-3 font-semibold">Impressions</th>
              <th className="px-4 py-3 font-semibold">CTR</th>
              <th className="px-4 py-3 font-semibold">
                <span className="block">CTR change</span>
                <span className="normal-case tracking-normal text-[#9aa3b2]">
                  vs previous 30 days
                </span>
              </th>
              <th className="px-5 py-3 font-semibold">Claim rate</th>
            </tr>
          </thead>
          <tbody>
            {investigation.devices.map((device) => (
              <tr
                key={device.device}
                className={`border-b border-[#eef2f7] last:border-0 ${
                  device.device === supportingDevice?.device && isSupportingDataVisible
                    ? "bg-[#f5f3ff]"
                    : ""
                }`}
              >
                <td className="px-5 py-4 font-semibold text-[#101218]">{device.device}</td>
                <td className="px-4 py-4 font-medium text-[#374151]">{device.share}</td>
                <td className="px-4 py-4 font-medium text-[#374151]">{device.impressions}</td>
                <td className="px-4 py-4 font-medium text-[#374151]">{device.ctr}</td>
                <td className="px-4 py-4">
                  <CtrChange value={device.ctrChange} />
                </td>
                <td className="px-5 py-4 font-medium text-[#374151]">{device.claimRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <InsightActionArea
        isVisible={isInsightVisible}
        buttonLabel={hasMeaningfulDeviceSignal(investigation.devices) ? "View insight" : "Generate insight"}
        insight={investigation.deviceInsight}
        recommendation={investigation.deviceRecommendation}
        explanation={deviceExplanation(investigation.devices)}
        onShow={() => setIsInsightVisible(true)}
        onDismiss={() => {
          setIsInsightVisible(false);
          setIsSupportingDataVisible(false);
        }}
        onViewSupportingData={() => setIsSupportingDataVisible(true)}
      />
    </section>
  );
}

function InsightActionArea({
  isVisible,
  buttonLabel,
  insight,
  recommendation,
  explanation,
  onShow,
  onDismiss,
  onViewSupportingData,
}: {
  isVisible: boolean;
  buttonLabel: string;
  insight: string;
  recommendation: string;
  explanation: string;
  onShow: () => void;
  onDismiss: () => void;
  onViewSupportingData: () => void;
}) {
  const [isExplanationVisible, setIsExplanationVisible] = useState(false);

  if (!isVisible) {
    return (
      <div className="border-t border-[#eef2f7] px-5 py-4">
        <button
          className="inline-flex h-9 items-center rounded-lg border border-[#ddd6fe] bg-[#f5f3ff] px-3 text-sm font-semibold text-[#7c3aed] hover:border-[#a78bfa] hover:bg-[#ede9fe] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed]"
          onClick={() => {
            setIsExplanationVisible(false);
            onShow();
          }}
        >
          {buttonLabel}
        </button>
      </div>
    );
  }

  return (
    <div className="border-t border-[#eef2f7] px-5 py-4">
      <div className="relative overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#7c3aed_0%,#3b82f6_100%)]" />
        <div className="flex max-w-5xl flex-col gap-3">
          <div>
            <span className="inline-flex rounded-full bg-[#ede9fe] px-2.5 py-1 text-[11px] font-semibold text-[#7c3aed]">
              Insight
            </span>
            <p className="mt-3 text-sm leading-6 text-[#30363a]">{insight}</p>
          </div>
          <div className="rounded-lg bg-[#fafbfd] px-3 py-3">
            <p className="text-xs font-semibold text-[#647084]">Suggested next move</p>
            <p className="mt-1 text-sm leading-6 text-[#374151]">{recommendation}</p>
          </div>
        </div>
        {isExplanationVisible ? (
          <div className="mt-3 rounded-lg border border-[#dfe2e2] bg-[#f5f7fa] px-3 py-2">
            <p className="text-sm leading-6 text-[#647084]">{explanation}</p>
          </div>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            className="inline-flex h-8 items-center rounded-lg bg-[#7c3aed] px-3 text-xs font-semibold text-white hover:bg-[#6d28d9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed]"
            onClick={() => setIsExplanationVisible(true)}
          >
            Ask why
          </button>
          <button
            className="inline-flex h-8 items-center rounded-lg border border-[#ddd6fe] bg-white px-3 text-xs font-semibold text-[#7c3aed] hover:bg-[#f5f3ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed]"
            onClick={onViewSupportingData}
          >
            View supporting data
          </button>
          <button
            className="inline-flex h-8 items-center rounded-lg px-3 text-xs font-semibold text-[#687080] hover:bg-[#fafbfd] hover:text-[#374151] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed]"
            onClick={() => {
              setIsExplanationVisible(false);
              onDismiss();
            }}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

function AiExplanation() {
  return (
    <section className="rounded-2xl border border-[#e5e7eb] bg-white p-4" aria-labelledby="ai-heading">
      <h2 id="ai-heading" className="text-sm font-semibold text-[#101218]">
        Ask about this offer
      </h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {[
          "Why did CTR decline?",
          "Which placement changed most?",
          "Is mobile underperforming desktop?",
          "When did performance start dropping?",
          "What should I investigate next?",
        ].map((prompt) => (
          <button
            key={prompt}
            className="rounded-lg border border-[#dfe2e2] px-3 py-2 text-left text-sm text-[#374151] hover:border-[#ddd6fe] hover:bg-[#f5f3ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed]"
          >
            {prompt}
          </button>
        ))}
      </div>
    </section>
  );
}

function EvidenceStat({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: Tone;
}) {
  const toneClass = {
    positive: "text-[#047857]",
    negative: "text-[#b42318]",
    neutral: "text-[#101218]",
    warning: "text-[#9a6700]",
  }[tone];

  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-white px-3 py-3">
      <p className="text-xs text-[#687080]">{label}</p>
      <p className={`mt-1 text-base font-semibold ${toneClass}`}>{value}</p>
    </div>
  );
}

function LineChart({
  values,
  previousValues,
  annotation,
  annotations,
  labels,
  selectedAnnotationIndex,
  onSelectAnnotation,
  currentLabel = "Current",
  referenceLabel = "Current overall metric",
  valueLabelFormatter = defaultChartValueFormatter,
}: {
  values: number[];
  previousValues?: number[];
  annotation: string;
  annotations?: ChartAnnotation[];
  labels?: string[];
  selectedAnnotationIndex?: number | null;
  onSelectAnnotation?: (value: number | null) => void;
  currentLabel?: string;
  referenceLabel?: string;
  valueLabelFormatter?: (value: number) => string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredAnnotationIndex, setHoveredAnnotationIndex] = useState<number | null>(null);
  const width = 760;
  const height = 220;
  const padding = { top: 24, right: 28, bottom: 40, left: 58 };
  const allValues = previousValues ? [...values, ...previousValues] : values;
  const min = Math.min(...allValues) - Math.max(Math.max(...allValues) * 0.08, 0.3);
  const max = Math.max(...allValues) + Math.max(Math.max(...allValues) * 0.08, 0.3);

  const points = values.map((value, index) =>
    pointFor(value, index, values.length, width, height, padding, min, max),
  );
  const previousPoints = previousValues?.map((value, index) =>
    pointFor(value, index, previousValues.length, width, height, padding, min, max),
  );
  const displayedAnnotations = annotations ?? [];
  const safeActiveIndex =
    activeIndex === null ? null : Math.min(points.length - 1, Math.max(0, activeIndex));
  const activePoint = safeActiveIndex === null ? null : points[safeActiveIndex];
  const activeValue = safeActiveIndex === null ? null : values[safeActiveIndex];
  const activeReference =
    previousValues && safeActiveIndex !== null
      ? previousValues[Math.min(previousValues.length - 1, safeActiveIndex)]
      : null;
  const tooltipX =
    activePoint && activePoint.x > width - 230 ? activePoint.x - 166 : (activePoint?.x ?? 0) + 14;
  const tooltipY = activePoint ? Math.max(10, Math.min(height - 76, activePoint.y - 38)) : 0;
  const selectedAnnotationPoint =
    selectedAnnotationIndex === null || selectedAnnotationIndex === undefined
      ? null
      : points[Math.min(points.length - 1, Math.max(0, selectedAnnotationIndex))];
  const yTicks = Array.from({ length: 4 }, (_, index) => {
    const value = max - (index / 3) * (max - min);
    return {
      value,
      y: pointFor(value, 0, values.length, width, height, padding, min, max).y,
    };
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-full w-full"
      role="img"
      aria-label={`${annotation}. Hover or focus a point to inspect chart data.`}
      onClick={() => onSelectAnnotation?.(null)}
      onMouseLeave={() => {
        setActiveIndex(null);
        setHoveredAnnotationIndex(null);
      }}
    >
      {yTicks.map((tick) => (
        <g key={tick.value}>
          <text x={padding.left - 10} y={tick.y + 4} fill="#687080" fontSize="11" textAnchor="end">
            {valueLabelFormatter(tick.value)}
          </text>
          <line
            x1={padding.left}
            x2={width - padding.right}
            y1={tick.y}
            y2={tick.y}
            stroke="#e5e7e7"
          />
        </g>
      ))}
      {previousPoints ? (
        <path
          d={pathFrom(previousPoints)}
          fill="none"
          stroke="#9ca3af"
          strokeDasharray="6 6"
          strokeWidth="3"
        />
      ) : null}
      <path d={pathFrom(points)} fill="none" stroke="#7c3aed" strokeWidth="4" />
      {previousPoints?.map((point, index) => (
        <circle key={`previous-${index}`} cx={point.x} cy={point.y} r="3" fill="#9ca3af" />
      ))}
      {displayedAnnotations.map((item) => {
        const point = points[Math.min(points.length - 1, Math.max(0, item.index))];
        const isSelected = selectedAnnotationIndex === item.index;
        const isHovered = hoveredAnnotationIndex === item.index;

        return (
          <line
            key={`${item.label}-line`}
            x1={point.x}
            x2={point.x}
            y1={padding.top + 8}
            y2={height - padding.bottom - 8}
            stroke={isSelected || isHovered ? "#7c3aed" : "#e5e7eb"}
            strokeDasharray="2 7"
            strokeLinecap="round"
            strokeWidth={isSelected || isHovered ? "2" : "1.5"}
            opacity={
              selectedAnnotationIndex !== null && selectedAnnotationIndex !== undefined && !isSelected
                ? 0.4
                : 1
            }
          />
        );
      })}
      {points.map((point, index) => {
        const isActive = index === activeIndex;
        const isEventSelected = selectedAnnotationIndex === index;
        const pointValue = values[index] ?? 0;

        return (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="12"
              fill="transparent"
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={
                activeReference === null
                  ? `${labels?.[index] ?? chartPeriods[index] ?? `Point ${index + 1}`}: ${currentLabel} ${valueLabelFormatter(pointValue)}`
                  : `${labels?.[index] ?? chartPeriods[index] ?? `Point ${index + 1}`}: ${currentLabel} ${valueLabelFormatter(pointValue)}, ${referenceLabel} ${valueLabelFormatter(previousValues?.[index] ?? 0)}`
              }
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onBlur={() => setActiveIndex(null)}
            />
            <circle
              cx={point.x}
              cy={point.y}
              r={isActive || isEventSelected ? "6" : "4"}
              fill="#7c3aed"
              stroke={isActive || isEventSelected ? "#ffffff" : "none"}
              strokeWidth={isActive || isEventSelected ? "3" : "0"}
            />
            <text
              x={point.x}
              y={height - padding.bottom + 22}
              fill={isActive ? "#4c1d95" : "#687080"}
              fontSize="11"
              fontWeight={isActive ? "700" : "500"}
              textAnchor="middle"
            >
              {labels?.[index] ?? chartPeriods[index] ?? index + 1}
            </text>
          </g>
        );
      })}
      {displayedAnnotations.map((item) => {
        const point = points[Math.min(points.length - 1, Math.max(0, item.index))];
        const isSelected = selectedAnnotationIndex === item.index;
        const isHovered = hoveredAnnotationIndex === item.index;

        return (
          <g
            key={item.label}
            opacity={
              selectedAnnotationIndex !== null && selectedAnnotationIndex !== undefined && !isSelected
                ? 0.46
                : 1
            }
          >
            <circle
              cx={point.x}
              cy={padding.top + 8}
              r={isSelected || isHovered ? "6" : "4.5"}
              fill={isSelected || isHovered ? "#7c3aed" : "#93c5fd"}
              stroke="#ffffff"
              strokeWidth="2"
            />
            <circle
              cx={point.x}
              cy={padding.top + 8}
              r="15"
              fill="transparent"
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={`Event ${eventShortLabel(item.label)} ${eventDescription(item.label)}`}
              onMouseEnter={() => setHoveredAnnotationIndex(item.index)}
              onFocus={() => setHoveredAnnotationIndex(item.index)}
              onMouseLeave={() => setHoveredAnnotationIndex(null)}
              onBlur={() => setHoveredAnnotationIndex(null)}
              onClick={(event) => {
                event.stopPropagation();
                setActiveIndex(null);
                onSelectAnnotation?.(isSelected ? null : item.index);
              }}
            />
          </g>
        );
      })}
      {selectedAnnotationPoint ? (
        <circle
          cx={selectedAnnotationPoint.x}
          cy={selectedAnnotationPoint.y}
          r="9"
          fill="none"
          stroke="#7c3aed"
          strokeWidth="2"
        />
      ) : null}
      {activePoint && activeValue !== null ? (
        <>
          <line
            x1={activePoint.x}
            x2={activePoint.x}
            y1={padding.top}
            y2={height - padding.bottom}
            stroke="#7c3aed"
            strokeDasharray="3 4"
          />
          <foreignObject x={tooltipX} y={tooltipY} width="152" height="64">
            <div className="rounded-lg border border-[#ddd6fe] bg-white px-3 py-2 text-xs leading-5 shadow-sm">
              <p className="font-semibold text-[#101218]">
                {labels?.[safeActiveIndex ?? 0] ?? chartPeriods[safeActiveIndex ?? 0] ?? `Point ${(safeActiveIndex ?? 0) + 1}`}
              </p>
              <p className="text-[#7c3aed]">
                {currentLabel}: {valueLabelFormatter(activeValue)}
              </p>
              {activeReference !== null ? (
                <p className="text-[#687080]">
                  {referenceLabel}: {valueLabelFormatter(activeReference)}
                </p>
              ) : null}
            </div>
          </foreignObject>
        </>
      ) : null}
      {displayedAnnotations.map((item) => {
        const point = points[Math.min(points.length - 1, Math.max(0, item.index))];
        const isSelected = selectedAnnotationIndex === item.index;
        const isHovered = hoveredAnnotationIndex === item.index;
        const shouldShow = isSelected || isHovered;
        const labelX = point.x > width - 210 ? point.x - 176 : point.x + 12;
        const labelY = Math.max(12, Math.min(height - 92, point.y - 52));

        if (!shouldShow) {
          return null;
        }

        return (
          <foreignObject key={`${item.label}-popover`} x={labelX} y={labelY} width="184" height="80">
            <div className="rounded-lg border border-[#ead7a5] bg-white px-3 py-2 text-xs leading-5 shadow-sm">
              <p className="font-semibold text-[#775a10]">{eventShortLabel(item.label)}</p>
              <p className="text-[#647084]">{eventDescription(item.label)}</p>
            </div>
          </foreignObject>
        );
      })}
      <text x={padding.left} y={height - 4} fill="#7c3aed" fontSize="12" fontWeight="600">
        {currentLabel}
      </text>
      {previousValues ? (
        <>
          <line x1={width - 205} x2={width - 181} y1={height - 9} y2={height - 9} stroke="#9ca3af" strokeDasharray="5 5" strokeWidth="3" />
          <text x={width - 174} y={height - 4} fill="#687080" fontSize="12">
            {referenceLabel}
          </text>
        </>
      ) : null}
    </svg>
  );
}

function PlacementDetailDrawer({
  placement,
  onClose,
  onDecision,
}: {
  placement: PlacementPerformance;
  onClose: () => void;
  onDecision: (value: string) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/20"
      role="dialog"
      aria-modal="true"
      aria-labelledby="placement-panel-title"
    >
      <aside className="h-full w-full max-w-xl overflow-y-auto border-l border-[#e5e7eb] bg-white p-4 shadow-xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[#687080]">Placement detail</p>
            <h2 id="placement-panel-title" className="mt-1 text-2xl font-semibold text-[#101218]">
              {placement.name}
            </h2>
          </div>
          <button
            className="rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm font-medium text-[#374151] hover:bg-[#fafbfd] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed]"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <EvidenceStat label="Impressions" value={placement.impressions} />
          <EvidenceStat label="CTR" value={placement.ctr} tone="negative" />
          <EvidenceStat label="30 days ago" value={placement.previousCtr} />
          <div className="rounded-2xl border border-[#e5e7eb] bg-white px-3 py-3">
            <p className="text-xs text-[#687080]">Change</p>
            <div className="mt-1">
              <CtrChange value={placement.ctrChange} />
            </div>
          </div>
          <EvidenceStat label="Claim rate" value={placement.claimRate} />
        </div>

        {placement.deviceBreakdown ? (
          <div className="mt-6 rounded-2xl border border-[#e5e7eb] bg-white p-4">
            <h3 className="text-base font-semibold text-[#101218]">Device breakdown</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {placement.deviceBreakdown.map((item) => (
                <EvidenceStat key={item.device} label={item.device} value={`CTR ${item.ctr}`} />
              ))}
            </div>
            <p className="mt-4 text-sm leading-6 text-[#647084]">
              Review the mobile Tracking Page experience first, then compare it against desktop.
            </p>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-2">
          {["Review Tracking Page", "Review offer", "Continue monitoring"].map((action) => (
            <button
              key={action}
              className={`rounded-lg px-3 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed] ${
                action === "Review Tracking Page"
                  ? "bg-[#111827] text-white hover:bg-[#2b3442]"
                  : "border border-[#e5e7eb] text-[#374151] hover:bg-[#fafbfd]"
              }`}
              onClick={() => onDecision(action)}
            >
              {action}
            </button>
          ))}
          <button
            className="rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-[#687080] hover:bg-[#fafbfd] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed]"
            onClick={onClose}
          >
            Return to offer
          </button>
        </div>
      </aside>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  const id = label.toLowerCase().replaceAll(" ", "-");

  return (
    <>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        className="h-9 w-full rounded-lg border border-[#d1d5db] bg-white px-3 text-sm font-medium text-[#374151] outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-[#c4b5fd] sm:w-auto"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </>
  );
}

function SegmentedControl({
  label,
  values,
  active,
  onChange,
}: {
  label: string;
  values: string[];
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      className="inline-flex rounded-2xl border border-[#e5e7eb] bg-[#f5f7fa] p-1 shadow-sm"
      role="group"
      aria-label={label}
    >
      {values.map((value) => (
        <button
          key={value}
          className={`h-8 rounded-lg px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7c3aed] ${
            active === value
              ? "bg-white text-[#7c3aed] shadow-sm ring-1 ring-[#ddd6fe]"
              : "text-[#687080] hover:bg-white hover:text-[#374151]"
          }`}
          onClick={() => onChange(value)}
        >
          {value}
        </button>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: OfferStatus }) {
  const className = {
    "Needs attention": "border-[#ead7a5] bg-[#fff8e5] text-[#775a10]",
    "Top performer": "border-[#bbf7d0] bg-[#ecfdf5] text-[#047857]",
    "On track": "border-[#dfe2e2] bg-[#f4f6f6] text-[#647084]",
  }[status];

  return (
    <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${className}`}>
      {status}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: Offer["severity"] }) {
  const className = {
    High: "bg-[#fff1ed] text-[#b42318] border-[#ffd0c7]",
    Medium: "bg-[#fff8e5] text-[#775a10] border-[#ead7a5]",
    Low: "bg-[#f4f6f6] text-[#647084] border-[#dfe2e2]",
  }[severity];

  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${className}`}>
      {severity}
    </span>
  );
}

function pointFor(
  value: number,
  index: number,
  length: number,
  width: number,
  height: number,
  padding: { top: number; right: number; bottom: number; left: number },
  min: number,
  max: number,
) {
  const x =
    padding.left + (index / (length - 1)) * (width - padding.left - padding.right);
  const y =
    height -
    padding.bottom -
    ((value - min) / (max - min)) * (height - padding.top - padding.bottom);

  return { x, y };
}

function pathFrom(points: Array<{ x: number; y: number }>) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
}

function percentToNumber(value: string) {
  const match = value.match(/-?\d+(\.\d+)?/);

  return match ? Number(match[0]) : 0;
}

function numberLabelToThousands(value: string) {
  const match = value.match(/(\d+(\.\d+)?)([MK])?/i);

  if (!match) {
    return 0;
  }

  const amount = Number(match[1]);
  const unit = match[3]?.toUpperCase();

  if (unit === "M") {
    return amount * 1000;
  }

  return amount;
}

function buildTrend(previousCtr: number, currentCtr: number, change: number) {
  if (Math.abs(change) < 0.15) {
    return [
      previousCtr,
      previousCtr + 0.05,
      previousCtr,
      currentCtr - 0.04,
      currentCtr,
      currentCtr + 0.03,
      currentCtr,
    ];
  }

  const weights = [0, 0.12, 0.25, 0.48, 0.68, 0.86, 1];

  return weights.map((weight) => {
    const value = previousCtr + (currentCtr - previousCtr) * weight;

    return Number(value.toFixed(2));
  });
}

function hasMeaningfulPlacementSignal(placements: PlacementPerformance[]) {
  return placements.some((placement) => Math.abs(placement.ctrChange) >= 0.3);
}

function strongestPlacementSignal(placements: PlacementPerformance[]) {
  return placements.reduce<PlacementPerformance | null>((strongest, placement) => {
    if (!strongest || Math.abs(placement.ctrChange) > Math.abs(strongest.ctrChange)) {
      return placement;
    }

    return strongest;
  }, null);
}

function placementExplanation(placements: PlacementPerformance[]) {
  const strongest = strongestPlacementSignal(placements);

  if (!strongest) {
    return "The active placements are close together, so there is no single placement driving the movement.";
  }

  return `${strongest.name} has ${strongest.impressions} impressions, ${strongest.ctr} CTR, and ${formatChangeLabel(strongest.ctrChange)} CTR change versus the previous 30 days.`;
}

function hasMeaningfulDeviceSignal(devices: DevicePerformance[]) {
  const ctrValues = devices.map((device) => percentToNumber(device.ctr));
  const ctrSpread = Math.max(...ctrValues) - Math.min(...ctrValues);

  return ctrSpread >= 0.4 || devices.some((device) => Math.abs(device.ctrChange) >= 0.3);
}

function strongestDeviceSignal(devices: DevicePerformance[]) {
  return devices.reduce<DevicePerformance | null>((strongest, device) => {
    if (!strongest || Math.abs(device.ctrChange) > Math.abs(strongest.ctrChange)) {
      return device;
    }

    return strongest;
  }, null);
}

function deviceExplanation(devices: DevicePerformance[]) {
  const strongest = strongestDeviceSignal(devices);
  const highestCtr = devices.reduce<DevicePerformance | null>((highest, device) => {
    if (!highest || percentToNumber(device.ctr) > percentToNumber(highest.ctr)) {
      return device;
    }

    return highest;
  }, null);

  if (!strongest || !highestCtr) {
    return "The device rows do not show a meaningful difference in CTR or recent movement.";
  }

  return `${strongest.device} has ${strongest.share} of impressions and ${formatChangeLabel(strongest.ctrChange)} CTR change, while ${highestCtr.device} has the higher current CTR at ${highestCtr.ctr}.`;
}

function formatChangeLabel(value: number) {
  const direction = value <= -0.15 ? " ↓" : value >= 0.15 ? " ↑" : "";

  return `${Math.abs(value).toFixed(1)} pp${direction}`;
}

function changeToneClass(value: number) {
  if (value <= -0.15) {
    return "text-[#b42318]";
  }

  if (value >= 0.15) {
    return "text-[#047857]";
  }

  return "text-[#687080]";
}

function trendPeriodFor(investigation: OfferInvestigation, range: Range): TrendPeriod {
  if (investigation.trendRanges?.[range]) {
    return investigation.trendRanges[range];
  }

  const rangeMultiplier = range === "7 days" ? 0.35 : range === "90 days" ? 1.5 : 1;
  const change = Number((investigation.trendChange * rangeMultiplier).toFixed(1));
  const currentCtr = percentToNumber(investigation.trendEnd);
  const startCtr = Math.max(0.1, currentCtr - change);
  const labels =
    range === "7 days"
      ? chartPeriodLabels["7 days"]
      : range === "90 days"
        ? chartPeriodLabels["90 days"]
        : chartPeriodLabels["30 days"];

  return {
    values: buildTrend(startCtr, currentCtr, change),
    labels,
    startLabel: `${startCtr.toFixed(1)}%`,
    endLabel: investigation.trendEnd,
    change,
    summary: investigation.trendSummary,
    annotations: range === "30 days" ? investigation.timelineAnnotations : [],
  };
}

function eventShortLabel(label: string) {
  const parts = label.split(" ");
  const first = parts[0];

  if (!first) {
    return "Event";
  }

  if (first === "Today") {
    return first;
  }

  if (isMonthLabel(first)) {
    return `${first} ${parts[1] ?? ""}`.trim();
  }

  return first;
}

function eventDescription(label: string) {
  const parts = label.split(" ");
  const offset = parts[0] === "Today" ? 1 : isMonthLabel(parts[0] ?? "") ? 2 : 1;

  return parts.slice(offset).join(" ");
}

function isMonthLabel(value: string) {
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].includes(value);
}

function defaultChartValueFormatter(value: number) {
  return value.toFixed(1);
}
