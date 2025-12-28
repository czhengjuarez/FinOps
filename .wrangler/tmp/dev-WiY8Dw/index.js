var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.js
var src_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      return handleAPIRequest(request, env, url);
    }
    try {
      const asset = await env.ASSETS.fetch(request);
      if (asset.status !== 404) {
        return asset;
      }
      if (!url.pathname.includes(".")) {
        const indexRequest = new Request(`${url.origin}/index.html`, request);
        return await env.ASSETS.fetch(indexRequest);
      }
      return asset;
    } catch (e) {
      return new Response("Not Found", { status: 404 });
    }
  }
};
async function handleAPIRequest(request, env, url) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    if (url.pathname === "/api/optimize-travel") {
      return await handleTravelOptimization(request, env, corsHeaders);
    } else if (url.pathname === "/api/analyze-roi") {
      return await handleROIAnalysis(request, env, corsHeaders);
    } else if (url.pathname === "/api/strategic-insights") {
      return await handleStrategicInsights(request, env, corsHeaders);
    }
    return new Response("API endpoint not found", { status: 404, headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
__name(handleAPIRequest, "handleAPIRequest");
async function handleTravelOptimization(request, env, corsHeaders) {
  const data = await request.json();
  const { attendees, nights, location, budget, dates } = data;
  const prompt = `Analyze this team event and provide concise recommendations:
- Attendees: ${attendees}
- Duration: ${nights} nights
- Location: ${location || "flexible"}
- Budget: $${budget || "flexible"}
- Dates: ${dates || "flexible"}

Return ONLY valid JSON (no extra text):
{
  "optimalTiming": {
    "bestMonths": ["month1", "month2"],
    "reasoning": "brief explanation",
    "potentialSavings": "15%"
  },
  "locationRecommendations": [
    {
      "city": "city name",
      "estimatedCostPerPerson": 2000,
      "pros": ["pro1", "pro2"],
      "cons": ["con1"]
    }
  ],
  "costOptimization": {
    "flightTips": "brief tip",
    "hotelTips": "brief tip",
    "estimatedTotal": 20000
  }
}`;
  const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
    messages: [
      { role: "system", content: "You are a financial planning assistant specializing in travel optimization. Always respond with valid, complete JSON. Keep responses concise." },
      { role: "user", content: prompt }
    ],
    max_tokens: 1024
  });
  return new Response(JSON.stringify({
    success: true,
    recommendations: response.response
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
__name(handleTravelOptimization, "handleTravelOptimization");
async function handleROIAnalysis(request, env, corsHeaders) {
  const data = await request.json();
  const { investment, timeSavings, qualityImprovements, efficiencyGains, context, question } = data;
  const prompt = `Analyze this ROI investment and return ONLY valid JSON with calculated numeric values (no expressions):

Investment: $${investment}
Time Savings: ${timeSavings.hours} hrs/month \xD7 $${timeSavings.hourlyRate}/hr
Quality: ${qualityImprovements.defectReduction}% defect reduction \xD7 $${qualityImprovements.costPerDefect}/defect
Efficiency: ${efficiencyGains.processImprovement}% improvement on $${efficiencyGains.currentCost}
Context: ${context || "Design operations"}
${question ? `Question: ${question}` : ""}

Return ONLY this JSON structure with CALCULATED NUMBERS (not math expressions):
{
  "roiAnalysis": {
    "totalAnnualBenefit": 500000,
    "netBenefit": 350000,
    "roiPercentage": 233,
    "paybackMonths": 5,
    "confidenceLevel": "high"
  },
  "insights": ["insight 1", "insight 2"],
  "recommendations": ["rec 1", "rec 2"],
  "riskFactors": ["risk 1"],
  "benchmarks": {
    "industryAverage": "200-300% typical",
    "yourPosition": "above average"
  }
}`;
  const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
    messages: [
      { role: "system", content: "You are a financial ROI analyst. Always respond with valid, complete JSON. Keep responses concise." },
      { role: "user", content: prompt }
    ],
    max_tokens: 1024
  });
  return new Response(JSON.stringify({
    success: true,
    analysis: response.response
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
__name(handleROIAnalysis, "handleROIAnalysis");
async function handleStrategicInsights(request, env, corsHeaders) {
  const data = await request.json();
  const { budgetData, previousYear, question } = data;
  const prompt = `You are a strategic financial advisor for design operations teams. 

Current Budget Data:
${JSON.stringify(budgetData, null, 2)}

Previous Year:
${JSON.stringify(previousYear, null, 2)}

${question ? `User Question: ${question}` : "Provide strategic insights"}

Analyze and provide strategic recommendations in JSON format:
{
  "executiveSummary": "2-3 sentence overview",
  "keyInsights": [
    {
      "category": "category name",
      "insight": "specific insight",
      "impact": "high/medium/low",
      "action": "recommended action"
    }
  ],
  "budgetHealth": {
    "score": "number 1-10",
    "status": "healthy/concerning/critical",
    "reasoning": "explanation"
  },
  "opportunities": [
    {
      "area": "area name",
      "potentialSavings": "amount or percentage",
      "effort": "low/medium/high",
      "recommendation": "specific action"
    }
  ],
  "warnings": [
    {
      "issue": "potential problem",
      "severity": "high/medium/low",
      "mitigation": "how to address"
    }
  ],
  "yearOverYearAnalysis": {
    "trend": "increasing/decreasing/stable",
    "majorChanges": ["change1", "change2"],
    "recommendation": "strategic advice"
  }
}`;
  const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
    messages: [
      { role: "system", content: "You are a strategic financial advisor. Always respond with valid, complete JSON. Keep responses concise." },
      { role: "user", content: prompt }
    ],
    max_tokens: 1024
  });
  return new Response(JSON.stringify({
    success: true,
    insights: response.response
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
__name(handleStrategicInsights, "handleStrategicInsights");

// ../../.nvm/versions/node/v22.17.0/lib/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../.nvm/versions/node/v22.17.0/lib/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-xylUA5/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// ../../.nvm/versions/node/v22.17.0/lib/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-xylUA5/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
