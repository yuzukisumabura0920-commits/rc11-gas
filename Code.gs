var structuredClone = (typeof structuredClone === 'function') ? structuredClone : function(input) {
  var data = JSON.stringify(input);
  if (typeof data !== 'string' || data.length > 200000) throw Error('GAS_PREVIEW_CLONE_LIMIT');
  return JSON.parse(data);
};
var RC11Next = (function(){
const __modules={"dist/contracts/schema.js":function(module,exports,__load){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractSchema = exports.LearningEventSchema = exports.RemoteBindingSchema = exports.TaskGroupSchema = exports.OccurrenceSchema = exports.AttemptSchema = exports.PolicyRevisionSchema = exports.ApprovalSchema = exports.ScopeSchema = exports.ProblemRefSchema = exports.InstantSchema = exports.DateSchema = exports.IdSchema = void 0;
exports.problemKey = problemKey;
const zod_1 = __load("node_modules/zod/lib/index.js");
exports.IdSchema = zod_1.z.string().min(1).refine(s => s.trim() === s && s.trim().length > 0, 'EMPTY_OR_PADDED_ID');
exports.DateSchema = zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(s => {
    const d = new Date(`${s}T00:00:00Z`);
    return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === s;
}, 'INVALID_CALENDAR_DATE');
// Require explicit offset; Date.parse alone accepts normalized invalid calendar dates.
exports.InstantSchema = zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/)
    .refine(s => exports.DateSchema.safeParse(s.slice(0, 10)).success &&
    Number(s.slice(11, 13)) < 24 && Number(s.slice(14, 16)) < 60 && Number(s.slice(17, 19)) < 60 &&
    (s.endsWith('Z') || (Number(s.slice(-5, -3)) <= 14 && Number(s.slice(-2)) < 60 &&
        (Number(s.slice(-5, -3)) !== 14 || Number(s.slice(-2)) === 0))) && Number.isFinite(Date.parse(s)), 'INVALID_INSTANT');
exports.ProblemRefSchema = zod_1.z.object({ materialId: exports.IdSchema, editionId: exports.IdSchema,
    problemKind: exports.IdSchema, problemNumber: exports.IdSchema, subquestionPath: zod_1.z.array(exports.IdSchema) }).strict();
function problemKey(p) {
    return JSON.stringify([p.materialId, p.editionId, p.problemKind, p.problemNumber, p.subquestionPath]);
}
exports.ScopeSchema = zod_1.z.discriminatedUnion('kind', [
    zod_1.z.object({ kind: zod_1.z.literal('exact'), problem: exports.ProblemRefSchema }).strict(),
    zod_1.z.object({ kind: zod_1.z.literal('whole'), problem: exports.ProblemRefSchema }).strict(),
    zod_1.z.object({ kind: zod_1.z.literal('remainder'), problem: exports.ProblemRefSchema, excluded: zod_1.z.array(exports.ProblemRefSchema).min(1) }).strict(),
    zod_1.z.object({ kind: zod_1.z.literal('unknown'), description: zod_1.z.string() }).strict()
]);
const SourceSchema = zod_1.z.object({ reference: exports.IdSchema, version: exports.IdSchema, recordedAt: exports.InstantSchema }).strict();
const ValiditySchema = zod_1.z.object({ from: exports.InstantSchema, until: exports.InstantSchema.nullable() }).strict()
    .refine(v => v.until === null || Date.parse(v.from) < Date.parse(v.until), 'INVALID_VALIDITY_INTERVAL');
exports.ApprovalSchema = zod_1.z.object({ approvalId: exports.IdSchema, source: SourceSchema, validity: ValiditySchema,
    scope: exports.ScopeSchema, version: exports.IdSchema }).strict();
exports.PolicyRevisionSchema = zod_1.z.object({ policyRevisionId: exports.IdSchema, policyId: exports.IdSchema, version: exports.IdSchema,
    source: SourceSchema, validity: ValiditySchema, scope: exports.ScopeSchema }).strict();
exports.AttemptSchema = zod_1.z.object({ attemptId: exports.IdSchema, problem: exports.ProblemRefSchema,
    performedAt: exports.InstantSchema.nullable(), explicitStudyDate: exports.DateSchema.nullable() }).strict();
exports.OccurrenceSchema = zod_1.z.object({ occurrenceId: exports.IdSchema, problem: exports.ProblemRefSchema,
    scope: exports.ScopeSchema, approvalId: exports.IdSchema, policyRevisionId: exports.IdSchema,
    scheduledDate: exports.DateSchema.nullable(), priority: zod_1.z.number().int().min(1).max(4),
    priorityConvention: zod_1.z.literal('uninterpreted-1-to-4'),
    firstAttemptBy: exports.DateSchema.nullable(), masteryBy: exports.DateSchema.nullable(),
    reviewWindow: zod_1.z.object({ from: exports.DateSchema, through: exports.DateSchema }).strict().refine(w => w.from <= w.through, 'INVALID_REVIEW_WINDOW').nullable()
}).strict();
exports.TaskGroupSchema = zod_1.z.object({ groupId: exports.IdSchema, occurrenceIds: zod_1.z.array(exports.IdSchema).min(1) }).strict();
exports.RemoteBindingSchema = zod_1.z.object({ bindingId: exports.IdSchema, groupId: exports.IdSchema,
    provider: zod_1.z.literal('todoist'), remoteTaskId: exports.IdSchema }).strict();
const eventBase = { eventId: exports.IdSchema, submissionId: exports.IdSchema, recordedAt: exports.InstantSchema };
exports.LearningEventSchema = zod_1.z.discriminatedUnion('kind', [
    zod_1.z.object({ ...eventBase, kind: zod_1.z.literal('grade'), attemptId: exports.IdSchema, scope: exports.ScopeSchema, grade: zod_1.z.enum(['○', '△', '×']) }).strict(),
    zod_1.z.object({ ...eventBase, kind: zod_1.z.literal('correction'), targetEventId: exports.IdSchema, replacementGrade: zod_1.z.enum(['○', '△', '×']), source: SourceSchema }).strict(),
    zod_1.z.object({ ...eventBase, kind: zod_1.z.literal('retraction'), targetEventId: exports.IdSchema, source: SourceSchema }).strict(),
    zod_1.z.object({ ...eventBase, kind: zod_1.z.literal('scope-confirmation'), approvalId: exports.IdSchema }).strict(),
    zod_1.z.object({ ...eventBase, kind: zod_1.z.literal('todoist-completion'), bindingId: exports.IdSchema, observedAt: exports.InstantSchema }).strict()
]);
exports.ContractSchema = zod_1.z.object({ schemaVersion: zod_1.z.literal(1), attempts: zod_1.z.array(exports.AttemptSchema),
    occurrences: zod_1.z.array(exports.OccurrenceSchema), approvals: zod_1.z.array(exports.ApprovalSchema), policies: zod_1.z.array(exports.PolicyRevisionSchema),
    groups: zod_1.z.array(exports.TaskGroupSchema), bindings: zod_1.z.array(exports.RemoteBindingSchema), events: zod_1.z.array(exports.LearningEventSchema) }).strict();

},
"dist/contracts/study-day.js":function(module,exports,__load){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studyDay = studyDay;
exports.reschedule = reschedule;
const schema_js_1 = __load("dist/contracts/schema.js");
/** Explicit user day has precedence. Unknown execution time never falls back to plan/receipt time. */
function studyDay(performedAt, explicitStudyDate = null) {
    const raw = { performedAt, explicitStudyDate };
    if (explicitStudyDate !== null) {
        const d = schema_js_1.DateSchema.safeParse(explicitStudyDate);
        return d.success ? { status: 'accept', value: d.data, raw, reasons: [] } : { status: 'reject', raw, reasons: [{ code: 'INVALID_EXPLICIT_DATE', path: 'explicitStudyDate' }] };
    }
    if (performedAt === null)
        return { status: 'HOLD', raw, reasons: [{ code: 'UNKNOWN_STUDY_DATE', path: 'performedAt' }] };
    const t = schema_js_1.InstantSchema.safeParse(performedAt);
    if (!t.success)
        return { status: 'reject', raw, reasons: [{ code: 'INVALID_INSTANT', path: 'performedAt' }] };
    // JST is UTC+9; shift back 4h for the learning-day boundary (net +5h).
    const shifted = new Date(Date.parse(t.data) + 5 * 60 * 60 * 1000);
    if (!Number.isFinite(shifted.getTime()) || shifted.getUTCFullYear() > 9999)
        return { status: 'reject', raw, reasons: [{ code: 'DATE_OVERFLOW', path: 'performedAt' }] };
    return { status: 'accept', value: shifted.toISOString().slice(0, 10), raw, reasons: [] };
}
function reschedule(o, scheduledDate) {
    return { ...o, scheduledDate: schema_js_1.DateSchema.parse(scheduledDate) };
}

},
"dist/core/canonical.js":function(module,exports,__load){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canonical = canonical;
/** Pure canonical JSON serialization shared by planner and journal.
 * Has no storage, asynchronous generators, or runtime dependencies.
 */
function canonical(x) {
    if (Array.isArray(x))
        return '[' + x.map(canonical).join(',') + ']';
    if (x !== null && typeof x === 'object')
        return '{' + Object.keys(x).sort().map(k => JSON.stringify(k) + ':' + canonical(x[k])).join(',') + '}';
    return JSON.stringify(x);
}

},
"dist/domain/chunk.js":function(module,exports,__load){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chunkOccurrences = chunkOccurrences;
const TARGET = 60;
const MAX = 80;
const GROUP_COST = 600;
function compatible(a, b) {
    return a.materialId === b.materialId && a.editionId === b.editionId &&
        a.scheduledDate === b.scheduledDate && a.kind === b.kind &&
        a.stage === b.stage && a.priority === b.priority;
}
function firstTotal(run, start, end) {
    return run.slice(start, end).reduce((sum, item) => sum + item.minutes, 0);
}
function partition(run) {
    const n = run.length;
    if (!n)
        return [];
    const dp = new Array(n + 1);
    dp[n] = { score: 0, groups: 0, parts: [] };
    for (let i = n - 1; i >= 0; --i) {
        let total = 0;
        let best;
        for (let j = i; j < n; ++j) {
            const item = run[j];
            if (!item)
                throw new Error("Missing occurrence");
            total += item.minutes;
            if (total > MAX && j !== i)
                break;
            // A >80-minute indivisible item may be displayed alone with an exception flag.
            const tail = dp[j + 1];
            if (!tail)
                throw new Error("Invalid partition tail");
            const candidate = {
                score: (total - TARGET) ** 2 + GROUP_COST + tail.score,
                groups: tail.groups + 1,
                parts: [j + 1, ...tail.parts]
            };
            if (!best || candidate.score < best.score ||
                (candidate.score === best.score && candidate.groups < best.groups) ||
                (candidate.score === best.score && candidate.groups === best.groups &&
                    Math.abs(total - TARGET) <
                        Math.abs(firstTotal(run, i, best.parts[0] ?? n) - TARGET))) {
                best = candidate;
            }
        }
        dp[i] = best;
    }
    const cuts = dp[0]?.parts ?? [];
    let start = 0;
    return cuts.map(end => {
        const members = run.slice(start, end);
        const totalMinutes = members.reduce((sum, item) => sum + item.minutes, 0);
        start = end;
        return {
            members,
            totalMinutes,
            oversizedIndivisible: members.length === 1 && totalMinutes > MAX
        };
    });
}
/** Pure deterministic display chunker: never mutates grades, plan dates or remote tasks. */
function chunkOccurrences(occurrences) {
    const ids = new Set();
    for (const occurrence of occurrences) {
        if (!Number.isSafeInteger(occurrence.minutes) || occurrence.minutes <= 0) {
            throw new Error("Invalid minutes");
        }
        if (!occurrence.occurrenceId || ids.has(occurrence.occurrenceId)) {
            throw new Error("Empty or duplicate occurrence ID");
        }
        ids.add(occurrence.occurrenceId);
    }
    const groups = [];
    let run = [];
    for (const occurrence of occurrences) {
        if (run.length && !compatible(run[0], occurrence)) {
            groups.push(...partition(run));
            run = [];
        }
        run.push(occurrence);
    }
    groups.push(...partition(run));
    return groups;
}

},
"dist/planning/engine.js":function(module,exports,__load){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateDailyPlan = exports.holdPlan = exports.newOccurrenceId = exports.PlanningInputsSchema = exports.PlanInputSchema = exports.PlanningDaySchema = exports.WorkSchema = void 0;
exports.simulatePlan = simulatePlan;
const zod_1 = __load("node_modules/zod/lib/index.js");
const schema_js_1 = __load("dist/contracts/schema.js");
const study_day_js_1 = __load("dist/contracts/study-day.js");
const canonical_js_1 = __load("dist/core/canonical.js");
const chunk_js_1 = __load("dist/domain/chunk.js");
const Stage = zod_1.z.enum(['NEW', 'R1', 'R2', 'R3']);
const Obligation = zod_1.z.object({ occurrenceId: schema_js_1.IdSchema, problem: schema_js_1.ProblemRefSchema, stage: Stage.exclude(['NEW']), idealReviewDate: schema_js_1.DateSchema }).strict();
exports.WorkSchema = zod_1.z.object({ problem: schema_js_1.ProblemRefSchema, policyRevision: schema_js_1.IdSchema, approvalRef: schema_js_1.IdSchema,
    priority: zod_1.z.number().int().min(1).max(4), rank: zod_1.z.number().optional(), minutes: zod_1.z.number().int().positive().max(1440).nullable(),
    firstAttemptBy: schema_js_1.DateSchema.nullable(), masteryBy: schema_js_1.DateSchema.nullable(), earliestDate: schema_js_1.DateSchema.optional(),
    state: zod_1.z.discriminatedUnion('status', [
        zod_1.z.object({ status: zod_1.z.literal('NEW') }).strict(),
        zod_1.z.object({ status: zod_1.z.literal('HOLD'), reasons: zod_1.z.array(schema_js_1.IdSchema).min(1), knownObligations: zod_1.z.array(Obligation).max(2) }).strict(),
        zod_1.z.object({ status: zod_1.z.literal('ready'), graduated: zod_1.z.boolean(), attemptCount: zod_1.z.number().int().positive(), obligations: zod_1.z.array(Obligation).max(2) }).strict()
    ]) }).strict();
exports.PlanningDaySchema = zod_1.z.object({ date: schema_js_1.DateSchema, classification: zod_1.z.enum(['weekday', 'rest']), totalMinutes: zod_1.z.number().int().min(0).max(1440),
    capacityExceptionRef: schema_js_1.IdSchema.nullable(), calendarEvidenceRef: schema_js_1.IdSchema,
    fixed: zod_1.z.array(zod_1.z.object({ id: schema_js_1.IdSchema, startMinute: zod_1.z.number().int().min(0).max(1439), endMinute: zod_1.z.number().int().min(1).max(1440) }).strict()) }).strict();
const Previous = zod_1.z.object({ occurrenceId: schema_js_1.IdSchema, scheduledDate: schema_js_1.DateSchema }).strict();
exports.PlanInputSchema = zod_1.z.object({ asOf: schema_js_1.InstantSchema, baseGeneration: zod_1.z.number().int().nonnegative(),
    policyRevision: schema_js_1.IdSchema, newMode: zod_1.z.enum(['enabled', 'disabled', 'hold']), days: zod_1.z.array(exports.PlanningDaySchema).max(366),
    work: zod_1.z.array(exports.WorkSchema).max(5000), previous: zod_1.z.array(Previous).max(10000),
    grouping: zod_1.z.object({ targetMinutes: zod_1.z.literal(60), implementationMaxMinutes: zod_1.z.literal(80) }).strict()
}).strict();
exports.PlanningInputsSchema = zod_1.z.object({ days: zod_1.z.array(exports.PlanningDaySchema).max(366), work: zod_1.z.array(exports.WorkSchema.omit({ state: true })).max(5000) }).strict();
const newOccurrenceId = (w) => (0, canonical_js_1.canonical)(['NEW', (0, schema_js_1.problemKey)(w.problem), w.policyRevision]);
exports.newOccurrenceId = newOccurrenceId;
const holdPlan = (reason, generation = 0) => ({ sourceGenerations: [], status: 'HOLD', reasons: [reason], baseGeneration: generation, generation,
    revisionId: 'HOLD', occurrences: [], groups: [], days: [], risks: [], executionAuthorized: false });
exports.holdPlan = holdPlan;
const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
function fixedMinutes(fixed) {
    if (new Set(fixed.map(f => f.id)).size !== fixed.length || fixed.some(f => f.endMinute <= f.startMinute))
        return null;
    const intervals = [...fixed].sort((a, b) => a.startMinute - b.startMinute);
    let end = 0, total = 0;
    for (const f of intervals) {
        total += Math.max(0, f.endMinute - Math.max(end, f.startMinute));
        end = Math.max(end, f.endMinute);
    }
    return total;
}
/** Pure simulation only. Signed scope/calendar/minute authority is checked by planWithSettings.
 * Display MAX=80 is inherited implementation detail, never an approved learning-time cap. */
function simulatePlan(raw, daily = false) {
    const p = exports.PlanInputSchema.safeParse(raw);
    if (!p.success)
        return (0, exports.holdPlan)('INVALID_PLAN_INPUT');
    const input = p.data, today = (0, study_day_js_1.studyDay)(input.asOf);
    if (today.status !== 'accept' || input.asOf.endsWith('-00:00'))
        return (0, exports.holdPlan)('UNKNOWN_PLAN_TIME', input.baseGeneration);
    if (new Set(input.work.map(w => (0, schema_js_1.problemKey)(w.problem))).size !== input.work.length || new Set(input.days.map(d => d.date)).size !== input.days.length || new Set(input.previous.map(o => o.occurrenceId)).size !== input.previous.length)
        return (0, exports.holdPlan)('DUPLICATE_PLAN_IDENTITY', input.baseGeneration);
    const plan = { sourceGenerations: [], status: 'ready', reasons: [], baseGeneration: input.baseGeneration, generation: input.baseGeneration + 1, revisionId: '', occurrences: [], groups: [], days: [], risks: [], executionAuthorized: false };
    for (const d of [...input.days].sort((a, b) => compare(a.date, b.date))) {
        const fixed = fixedMinutes(d.fixed);
        if (fixed === null || d.date < today.value)
            return (0, exports.holdPlan)('INVALID_DAY_OR_FIXED_COMMITMENT', input.baseGeneration);
        if (d.totalMinutes !== (d.classification === 'weekday' ? 300 : 600) && !d.capacityExceptionRef)
            return (0, exports.holdPlan)('UNAPPROVED_CAPACITY_EXCEPTION', input.baseGeneration);
        plan.days.push({ date: d.date, totalMinutes: d.totalMinutes, fixedMinutes: fixed, availableMinutes: Math.max(0, d.totalMinutes - fixed), usedMinutes: 0, overCapacityMinutes: Math.max(0, fixed - d.totalMinutes) });
    }
    for (const w of input.work) {
        const key = (0, schema_js_1.problemKey)(w.problem);
        let common = [];
        if (w.policyRevision !== input.policyRevision || w.policyRevision !== 'v0.3')
            common.push('POLICY_REVISION_HOLD');
        if (w.minutes === null)
            common.push('MISSING_DURATION');
        if (w.state.status === 'HOLD')
            common.push(...w.state.reasons);
        if (w.state.status === 'ready' && ((w.state.graduated && w.state.obligations.length > 0) || (!w.state.graduated && w.state.obligations.length === 0)))
            common.push('INCONSISTENT_LEARNING_STATE');
        const obs = w.state.status === 'NEW' ? [{ occurrenceId: (0, exports.newOccurrenceId)(w), problem: w.problem, stage: 'NEW', idealReviewDate: null }] : w.state.status === 'ready' ? w.state.obligations : w.state.knownObligations;
        // A held scope remains explicitly represented even when its next obligation is unknown.
        const represented = obs.length ? obs : (common.length ? [{ occurrenceId: (0, canonical_js_1.canonical)(['HOLD', key, w.policyRevision]), problem: w.problem, stage: 'NEW', idealReviewDate: null }] : []);
        for (const o of represented) {
            const reasons = [...common];
            if ((0, schema_js_1.problemKey)(o.problem) !== key)
                reasons.push('OBLIGATION_SCOPE_MISMATCH');
            if (o.stage === 'NEW' && input.newMode !== 'enabled')
                reasons.push(input.newMode === 'disabled' ? 'NEW_STOPPED' : 'NEW_MODE_HOLD');
            plan.occurrences.push({ occurrenceId: o.occurrenceId, problem: structuredClone(w.problem), stage: o.stage, idealReviewDate: o.idealReviewDate,
                approvalRef: w.approvalRef, priority: w.priority, minutes: w.minutes, firstAttemptBy: w.firstAttemptBy, masteryBy: w.masteryBy, policyRevision: w.policyRevision,
                status: reasons.length ? 'HOLD' : 'UNPLACED', scheduledDate: null, reasons: [...new Set(reasons)].sort() });
        }
    }
    if (new Set(plan.occurrences.map(o => o.occurrenceId)).size !== plan.occurrences.length)
        return (0, exports.holdPlan)('DUPLICATE_OCCURRENCE', input.baseGeneration);
    const deadline = (o) => o.stage === 'NEW' ? o.firstAttemptBy : o.masteryBy;
    // Preserve uninterpreted priority: tied deadline/ideal buckets with competing values HOLD.
    const bucket = (o) => (0, canonical_js_1.canonical)([deadline(o), o.idealReviewDate]);
    for (const o of daily ? [] : plan.occurrences.filter(o => o.status !== 'HOLD')) {
        if (new Set(plan.occurrences.filter(b => b.status !== 'HOLD' && bucket(b) === bucket(o)).map(b => b.priority)).size > 1) {
            // Mark the entire bucket after collecting it; never pick a winner from input order.
            for (const b of plan.occurrences.filter(b => bucket(b) === bucket(o))) {
                b.status = 'HOLD';
                b.reasons.push('PRIORITY_DIRECTION_REQUIRED');
            }
        }
    }
    const ranks = new Map(input.work.map(w => [(0, schema_js_1.problemKey)(w.problem), w.rank ?? w.priority]));
    plan.occurrences.sort((a, b) => compare(deadline(a) ?? '9999-12-31', deadline(b) ?? '9999-12-31') || compare(a.idealReviewDate ?? today.value, b.idealReviewDate ?? today.value) || (daily ? (ranks.get((0, schema_js_1.problemKey)(b.problem)) ?? b.priority) - (ranks.get((0, schema_js_1.problemKey)(a.problem)) ?? a.priority) : 0) || compare(a.occurrenceId, b.occurrenceId));
    for (const o of plan.occurrences) {
        if (o.status === 'HOLD')
            continue;
        const minutes = o.minutes;
        let earliest = o.idealReviewDate && o.idealReviewDate > today.value ? o.idealReviewDate : today.value;
        if (daily) {
            const w = input.work.find(w => (0, schema_js_1.problemKey)(w.problem) === (0, schema_js_1.problemKey)(o.problem));
            if (w?.earliestDate && w.earliestDate > earliest)
                earliest = w.earliestDate;
        }
        if (daily && o.stage === 'R2') {
            const r1 = plan.occurrences.find(x => x.stage === 'R1' && (0, schema_js_1.problemKey)(x.problem) === (0, schema_js_1.problemKey)(o.problem));
            if (r1) {
                if (r1.status !== 'SCHEDULED') {
                    o.reasons.push('WAITING_FOR_R1_PLACEMENT');
                    continue;
                }
                const next = new Date(r1.scheduledDate + 'T00:00:00Z');
                next.setUTCDate(next.getUTCDate() + 1);
                earliest = [earliest, next.toISOString().slice(0, 10)].sort().pop();
            }
        }
        const day = plan.days.find(d => d.date >= earliest && d.availableMinutes - d.usedMinutes >= minutes);
        if (!day) {
            o.reasons.push(plan.days.every(d => d.date < earliest) ? 'OUTSIDE_HORIZON' : 'CAPACITY_SHORTAGE');
            plan.risks.push({ occurrenceId: o.occurrenceId, code: o.reasons[0], missingMinutes: minutes });
            continue;
        }
        o.status = 'SCHEDULED';
        o.scheduledDate = day.date;
        day.usedMinutes += minutes;
        const prior = input.previous.find(p => p.occurrenceId === o.occurrenceId);
        if (prior && prior.scheduledDate < today.value)
            o.reasons.push('UNREPORTED_REPROPOSAL');
        else
            o.reasons.push(prior?.scheduledDate === day.date ? 'PLACEMENT_RETAINED' : prior ? 'CAPACITY_REPLAN' : 'EARLIEST_CAPACITY');
        const due = deadline(o);
        if (due && day.date > due)
            plan.risks.push({ occurrenceId: o.occurrenceId, code: o.stage === 'NEW' ? 'FIRST_ATTEMPT_DEADLINE_EXCEEDED' : 'MASTERY_DEADLINE_EXCEEDED', missingMinutes: minutes });
        if (o.masteryBy && (day.date > o.masteryBy || o.stage !== 'NEW'))
            plan.risks.push({ occurrenceId: o.occurrenceId, code: 'GRADUATION_NOT_GUARANTEED', missingMinutes: 0 });
    }
    // Chunk only compatible constraints; an 80-minute grouping implementation threshold is not policy.
    const bins = new Map();
    for (const o of plan.occurrences.filter(o => o.status === 'SCHEDULED')) {
        const k = (0, canonical_js_1.canonical)([o.problem.materialId, o.problem.editionId, o.problem.problemKind, o.scheduledDate, o.stage, o.priority, o.policyRevision, o.approvalRef, o.firstAttemptBy, o.masteryBy]);
        bins.set(k, [...(bins.get(k) ?? []), o]);
    }
    for (const [key, os] of [...bins].sort(([a], [b]) => compare(a, b))) {
        const display = os.map(o => ({ occurrenceId: o.occurrenceId, materialId: o.problem.materialId, editionId: o.problem.editionId, scheduledDate: o.scheduledDate, kind: o.stage === 'NEW' ? 'NEW' : 'REVIEW', stage: o.stage === 'R1' ? 'UNDERSTANDING' : o.stage === 'R2' ? 'RETENTION' : o.stage === 'R3' ? 'LONG_REVIEW' : '', priority: o.priority, minutes: o.minutes }));
        for (const g of (0, chunk_js_1.chunkOccurrences)(display))
            plan.groups.push({ groupId: (0, canonical_js_1.canonical)(['GROUP', key, g.members.map(m => m.occurrenceId)]), occurrenceIds: g.members.map(m => m.occurrenceId), scheduledDate: os[0].scheduledDate, stage: os[0].stage, minutes: g.totalMinutes, oversizedIndivisible: g.oversizedIndivisible });
    }
    plan.occurrences.sort((a, b) => compare(a.occurrenceId, b.occurrenceId));
    plan.revisionId = (0, canonical_js_1.canonical)(['PLAN', input.baseGeneration, input.asOf, plan.occurrences, plan.groups, plan.days]);
    // IDs/revisions contain private domain references. They are not public log messages.
    return plan;
}
/** Todoist convention: numeric 4 is highest. */
const simulateDailyPlan = (raw) => simulatePlan(raw, true);
exports.simulateDailyPlan = simulateDailyPlan;

},
"dist/review/engine.js":function(module,exports,__load){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replayDaily = exports.Report = void 0;
exports.advanceReview = advanceReview;
exports.replay = replay;
exports.normalizeException = normalizeException;
const zod_1 = __load("node_modules/zod/lib/index.js");
const schema_js_1 = __load("dist/contracts/schema.js");
exports.Report = zod_1.z.object({ submissionId: schema_js_1.IdSchema, attemptId: schema_js_1.IdSchema, problem: schema_js_1.ProblemRefSchema, studyDay: schema_js_1.DateSchema, reportedDay: schema_js_1.DateSchema, grade: zod_1.z.enum(['○', '△', '×']), policyRevision: zod_1.z.literal('v0.3'), raw: zod_1.z.string(), source: schema_js_1.IdSchema }).strict();
const plus = (day, n) => { const d = new Date(day + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
function advanceReview(previous, report, asOf, daily = false) {
    if (!exports.Report.safeParse(report).success || !schema_js_1.DateSchema.safeParse(asOf).success)
        return { status: 'HOLD', reason: 'INVALID_INPUT' };
    const r = report;
    if ((!daily && r.studyDay !== r.reportedDay) || r.studyDay > r.reportedDay || r.reportedDay > asOf)
        return { status: 'HOLD', reason: 'DELAYED_OR_FUTURE_REPORT' };
    if (previous && (0, schema_js_1.problemKey)(previous.first.problem) !== (0, schema_js_1.problemKey)(r.problem))
        return { status: 'HOLD', reason: 'MIXED_TARGET' };
    if (previous && r.studyDay <= previous.lastStudyDay)
        return { status: 'HOLD', reason: r.studyDay === previous.lastStudyDay ? 'SAME_DAY_ATTEMPTS' : 'EARLY_LATE_OR_MISSING_REVIEW' };
    if (previous?.graduated && !daily)
        return { status: 'HOLD', reason: 'POST_GRADUATION_ATTEMPT' };
    // A new failed attempt starts a fresh v0.3 cycle; a confirming ○ keeps graduation.
    const restart = daily && previous?.graduated && r.grade !== '○';
    const first = restart ? r : previous?.first ?? r, obligation = (stage, date, anchor) => ({ occurrenceId: JSON.stringify(['v0.3', (0, schema_js_1.problemKey)(first.problem), first.attemptId, stage, anchor]), problem: first.problem, stage, idealReviewDate: date });
    let graduated = false, obligations = [];
    if (!previous || restart) {
        if (r.grade === '○')
            graduated = true;
        else
            obligations = [obligation('R1', plus(r.studyDay, 1), first.attemptId), obligation('R2', plus(r.studyDay, 3), first.attemptId)];
    }
    else if (previous.graduated) {
        graduated = true;
    }
    else {
        const next = previous.obligations[0];
        if (!next || (daily ? next.idealReviewDate > r.studyDay : next.idealReviewDate !== r.studyDay))
            return { status: 'HOLD', reason: 'EARLY_LATE_OR_MISSING_REVIEW' };
        obligations = previous.obligations.slice(1);
        if (daily && next.stage === 'R1')
            obligations = obligations.map(o => ({ ...o, idealReviewDate: o.idealReviewDate <= r.studyDay ? plus(r.studyDay, 1) : o.idealReviewDate }));
        if (next.stage !== 'R1') {
            if (r.grade === '○') {
                graduated = true;
                obligations = [];
            }
            else
                obligations = [obligation('R3', plus(r.studyDay, 3), r.attemptId)];
        }
    }
    if (obligations.some(o => !schema_js_1.DateSchema.safeParse(o.idealReviewDate).success))
        return { status: 'HOLD', reason: 'REVIEW_DATE_OVERFLOW' };
    return { status: 'ready', checkpoint: { first, lastStudyDay: r.studyDay, attemptCount: (previous?.attemptCount ?? 0) + 1, graduated, obligations } };
}
/** Restricted chronological exact-target replay. No mutations, correction guessing or schedule writes. */
function replay(raw, asOf, daily = false) {
    const hold = (reason) => ({ status: 'HOLD', reasons: [reason], graduated: false, obligations: [], raw, executionAuthorized: false });
    const parsed = zod_1.z.array(exports.Report).safeParse(raw), today = schema_js_1.DateSchema.safeParse(asOf);
    if (!parsed.success || !today.success)
        return hold('INVALID_INPUT');
    const bySubmission = new Map(), byAttempt = new Map();
    for (const r of parsed.data) {
        const old = bySubmission.get(r.submissionId);
        if (old && JSON.stringify(old) !== JSON.stringify(r))
            return hold('SUBMISSION_CONFLICT');
        if (old)
            continue;
        const priorAttempt = byAttempt.get(r.attemptId);
        if (priorAttempt && (!daily || priorAttempt.studyDay !== r.studyDay || (0, schema_js_1.problemKey)(priorAttempt.problem) !== (0, schema_js_1.problemKey)(r.problem)))
            return hold('CORRECTION_OR_DUPLICATE_ATTEMPT_REQUIRES_RESOLUTION');
        bySubmission.set(r.submissionId, r);
        byAttempt.set(r.attemptId, r);
    }
    // Daily callers supply actual report order. The last report for a study day
    // replaces that day's effective grade without adding another review attempt.
    const effective = daily ? [...new Map([...byAttempt.values()].map(r => [JSON.stringify([(0, schema_js_1.problemKey)(r.problem), r.studyDay]), r])).values()] : [...byAttempt.values()];
    const rs = effective.sort((a, b) => a.studyDay.localeCompare(b.studyDay));
    if (!rs.length)
        return hold('NO_REPORTED_ATTEMPT');
    const first = rs[0];
    if (rs.some(r => (0, schema_js_1.problemKey)(r.problem) !== (0, schema_js_1.problemKey)(first.problem)))
        return hold('MIXED_TARGET');
    if (new Set(rs.map(r => r.studyDay)).size !== rs.length)
        return hold('SAME_DAY_ATTEMPTS');
    if (rs.some(r => (!daily && r.studyDay !== r.reportedDay) || r.studyDay > r.reportedDay || r.reportedDay > today.data))
        return hold('DELAYED_OR_FUTURE_REPORT');
    let state = null;
    for (const r of rs) {
        const step = advanceReview(state, r, today.data, daily);
        if (step.status === 'HOLD')
            return hold(step.reason);
        state = step.checkpoint;
    }
    const { obligations, graduated } = state;
    if (!daily && obligations[0]?.stage === 'R1' && obligations[1] && today.data >= obligations[1].idealReviewDate)
        return hold('MISSING_R1_AT_R2_DATE');
    return { status: 'ready', reasons: [], graduated, obligations, raw, executionAuthorized: false };
}
/** Explicit supported phrase only; remainder is evidence, never invented sibling events. */
function normalizeException(raw, context) {
    const match = /^(.+?)(\d+)\((\d+)\)([△×])$/.exec(raw);
    if (!match || match[1] !== context.materialLabel || match[2] !== context.problem.problemNumber || context.problem.subquestionPath.length !== 0)
        return { status: 'HOLD', raw, reason: 'UNSUPPORTED_OR_AMBIGUOUS_SCOPE' };
    const { materialLabel, ...base } = context;
    const report = { ...base, problem: { ...context.problem, subquestionPath: [match[3]] }, grade: match[4], raw };
    if (!exports.Report.safeParse(report).success)
        return { status: 'HOLD', raw, reason: 'INVALID_CONTEXT' };
    return { status: 'ready', report, label: `${materialLabel}${match[2]}(${match[3]})`,
        remainder: { kind: 'remainder', parent: context.problem, excluded: [report.problem], grade: '○', raw, source: context.source, attemptId: context.attemptId, policyRevision: context.policyRevision }, parentGraduation: 'HOLD_COVERAGE_REQUIRED' };
}
/** Daily-operation semantics: execution date drives reviews; late reporting and overdue reviews are accepted. */
const replayDaily = (raw, asOf) => replay(raw, asOf, true);
exports.replayDaily = replayDaily;

},
"dist/runtime/gas-pure.js":function(module,exports,__load){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readTodoistInventory = exports.studyDay = exports.chunkOccurrences = exports.simulateDailyPlan = exports.simulatePlan = exports.normalizeException = exports.advanceReview = exports.replayDaily = exports.replay = void 0;
/** Read-only, pure domain exports for the GAS V8 entrypoint.
 * Reuse the exact v0.3 and planner engines; do not fork their rules.
 * Importing this module grants no storage, scheduler, network or writer rights.
 */
var engine_js_1 = __load("dist/review/engine.js");
Object.defineProperty(exports, "replay", { enumerable: true, get: function () { return engine_js_1.replay; } });
Object.defineProperty(exports, "replayDaily", { enumerable: true, get: function () { return engine_js_1.replayDaily; } });
Object.defineProperty(exports, "advanceReview", { enumerable: true, get: function () { return engine_js_1.advanceReview; } });
Object.defineProperty(exports, "normalizeException", { enumerable: true, get: function () { return engine_js_1.normalizeException; } });
var engine_js_2 = __load("dist/planning/engine.js");
Object.defineProperty(exports, "simulatePlan", { enumerable: true, get: function () { return engine_js_2.simulatePlan; } });
Object.defineProperty(exports, "simulateDailyPlan", { enumerable: true, get: function () { return engine_js_2.simulateDailyPlan; } });
var chunk_js_1 = __load("dist/domain/chunk.js");
Object.defineProperty(exports, "chunkOccurrences", { enumerable: true, get: function () { return chunk_js_1.chunkOccurrences; } });
var study_day_js_1 = __load("dist/contracts/study-day.js");
Object.defineProperty(exports, "studyDay", { enumerable: true, get: function () { return study_day_js_1.studyDay; } });
var gas_todoist_js_1 = __load("dist/runtime/gas-todoist.js");
Object.defineProperty(exports, "readTodoistInventory", { enumerable: true, get: function () { return gas_todoist_js_1.readTodoistInventory; } });

},
"dist/runtime/gas-todoist.js":function(module,exports,__load){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readTodoistInventory = readTodoistInventory;
const validID = (s) => typeof s === 'string' && /^[A-Za-z0-9_-]{5,80}$/.test(s);
const hold = (reason, pages = 0) => ({ status: 'HOLD', reason, pages, snapshotComplete: false, executionAuthorized: false });
/** One approved project, bounded complete enumeration, no destructive operations.
 * cursor does not attest same-generation atomicity; use external cutover fencing
 * and owner-approved registry before considering any live adoption.
 */
function readTodoistInventory(http, token, projectId, maxPages = 20) {
    if (!validID(projectId) || typeof token !== 'string' || token.length < 8 || token.length > 512 ||
        !Number.isSafeInteger(maxPages) || maxPages < 1 || maxPages > 100)
        return hold('UNAPPROVED_OR_INVALID_READER');
    const tasks = [];
    const seenIds = new Set(), seenCursors = new Set();
    let cursor = null;
    for (let page = 1; page <= maxPages; page++) {
        const url = 'https://api.todoist.com/api/v1/tasks?project_id=' + encodeURIComponent(projectId) +
            '&limit=200' + (cursor === null ? '' : '&cursor=' + encodeURIComponent(cursor));
        let response;
        try {
            response = http.fetch(url, {
                method: 'get', headers: { Authorization: 'Bearer ' + token, Accept: 'application/json' },
                followRedirects: false, muteHttpExceptions: true
            });
        }
        catch {
            return hold('TODOIST_READ_UNCERTAIN', page);
        }
        if (response.getResponseCode() !== 200)
            return hold('TODOIST_READ_HTTP_ERROR', page);
        let parsed;
        try {
            const text = response.getContentText();
            if (typeof text !== 'string' || text.length > 2000000)
                return hold('TODOIST_PAGE_TOO_LARGE', page);
            parsed = JSON.parse(text);
        }
        catch {
            return hold('TODOIST_INVALID_JSON', page);
        }
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
            return hold('TODOIST_INVALID_PAGE', page);
        const result = parsed;
        if (!Array.isArray(result.results) || result.results.length > 200)
            return hold('TODOIST_INVALID_PAGE', page);
        for (const raw of result.results) {
            if (!raw || typeof raw !== 'object' || Array.isArray(raw))
                return hold('TODOIST_INVALID_TASK', page);
            const task = raw;
            if (!validID(task.id) || task.project_id !== projectId || seenIds.has(task.id))
                return hold('TODOIST_SCOPE_OR_DUPLICATE', page);
            seenIds.add(task.id);
            tasks.push(task);
        }
        if (result.next_cursor === null)
            return { status: 'read-only', tasks, pages: page, snapshotComplete: false, executionAuthorized: false };
        if (typeof result.next_cursor !== 'string' || !result.next_cursor || result.next_cursor.length > 1024 ||
            seenCursors.has(result.next_cursor))
            return hold('TODOIST_PAGINATION_INCOMPLETE', page);
        seenCursors.add(result.next_cursor);
        cursor = result.next_cursor;
    }
    return hold('TODOIST_MAX_PAGES', maxPages);
}

},
"node_modules/zod/lib/errors.js":function(module,exports,__load){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMap = exports.setErrorMap = exports.defaultErrorMap = void 0;
const en_1 = __importDefault(__load("node_modules/zod/lib/locales/en.js"));
exports.defaultErrorMap = en_1.default;
let overrideErrorMap = en_1.default;
function setErrorMap(map) {
    overrideErrorMap = map;
}
exports.setErrorMap = setErrorMap;
function getErrorMap() {
    return overrideErrorMap;
}
exports.getErrorMap = getErrorMap;

},
"node_modules/zod/lib/external.js":function(module,exports,__load){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined)
        k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function () { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function (o, m, k, k2) {
    if (k2 === undefined)
        k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function (m, exports) {
    for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p))
            __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__load("node_modules/zod/lib/errors.js"), exports);
__exportStar(__load("node_modules/zod/lib/helpers/parseUtil.js"), exports);
__exportStar(__load("node_modules/zod/lib/helpers/typeAliases.js"), exports);
__exportStar(__load("node_modules/zod/lib/helpers/util.js"), exports);
__exportStar(__load("node_modules/zod/lib/types.js"), exports);
__exportStar(__load("node_modules/zod/lib/ZodError.js"), exports);

},
"node_modules/zod/lib/helpers/errorUtil.js":function(module,exports,__load){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorUtil = void 0;
var errorUtil;
(function (errorUtil) {
    errorUtil.errToObj = (message) => typeof message === "string" ? { message } : message || {};
    errorUtil.toString = (message) => typeof message === "string" ? message : message === null || message === void 0 ? void 0 : message.message;
})(errorUtil || (exports.errorUtil = errorUtil = {}));

},
"node_modules/zod/lib/helpers/parseUtil.js":function(module,exports,__load){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAsync = exports.isValid = exports.isDirty = exports.isAborted = exports.OK = exports.DIRTY = exports.INVALID = exports.ParseStatus = exports.addIssueToContext = exports.EMPTY_PATH = exports.makeIssue = void 0;
const errors_1 = __load("node_modules/zod/lib/errors.js");
const en_1 = __importDefault(__load("node_modules/zod/lib/locales/en.js"));
const makeIssue = (params) => {
    const { data, path, errorMaps, issueData } = params;
    const fullPath = [...path, ...(issueData.path || [])];
    const fullIssue = {
        ...issueData,
        path: fullPath,
    };
    if (issueData.message !== undefined) {
        return {
            ...issueData,
            path: fullPath,
            message: issueData.message,
        };
    }
    let errorMessage = "";
    const maps = errorMaps
        .filter((m) => !!m)
        .slice()
        .reverse();
    for (const map of maps) {
        errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
    }
    return {
        ...issueData,
        path: fullPath,
        message: errorMessage,
    };
};
exports.makeIssue = makeIssue;
exports.EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
    const overrideMap = (0, errors_1.getErrorMap)();
    const issue = (0, exports.makeIssue)({
        issueData: issueData,
        data: ctx.data,
        path: ctx.path,
        errorMaps: [
            ctx.common.contextualErrorMap, // contextual error map is first priority
            ctx.schemaErrorMap, // then schema-bound map if available
            overrideMap, // then global override map
            overrideMap === en_1.default ? undefined : en_1.default, // then global default map
        ].filter((x) => !!x),
    });
    ctx.common.issues.push(issue);
}
exports.addIssueToContext = addIssueToContext;
class ParseStatus {
    constructor() {
        this.value = "valid";
    }
    dirty() {
        if (this.value === "valid")
            this.value = "dirty";
    }
    abort() {
        if (this.value !== "aborted")
            this.value = "aborted";
    }
    static mergeArray(status, results) {
        const arrayValue = [];
        for (const s of results) {
            if (s.status === "aborted")
                return exports.INVALID;
            if (s.status === "dirty")
                status.dirty();
            arrayValue.push(s.value);
        }
        return { status: status.value, value: arrayValue };
    }
    static async mergeObjectAsync(status, pairs) {
        const syncPairs = [];
        for (const pair of pairs) {
            const key = await pair.key;
            const value = await pair.value;
            syncPairs.push({
                key,
                value,
            });
        }
        return ParseStatus.mergeObjectSync(status, syncPairs);
    }
    static mergeObjectSync(status, pairs) {
        const finalObject = {};
        for (const pair of pairs) {
            const { key, value } = pair;
            if (key.status === "aborted")
                return exports.INVALID;
            if (value.status === "aborted")
                return exports.INVALID;
            if (key.status === "dirty")
                status.dirty();
            if (value.status === "dirty")
                status.dirty();
            if (key.value !== "__proto__" &&
                (typeof value.value !== "undefined" || pair.alwaysSet)) {
                finalObject[key.value] = value.value;
            }
        }
        return { status: status.value, value: finalObject };
    }
}
exports.ParseStatus = ParseStatus;
exports.INVALID = Object.freeze({
    status: "aborted",
});
const DIRTY = (value) => ({ status: "dirty", value });
exports.DIRTY = DIRTY;
const OK = (value) => ({ status: "valid", value });
exports.OK = OK;
const isAborted = (x) => x.status === "aborted";
exports.isAborted = isAborted;
const isDirty = (x) => x.status === "dirty";
exports.isDirty = isDirty;
const isValid = (x) => x.status === "valid";
exports.isValid = isValid;
const isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;
exports.isAsync = isAsync;

},
"node_modules/zod/lib/helpers/typeAliases.js":function(module,exports,__load){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},
"node_modules/zod/lib/helpers/util.js":function(module,exports,__load){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParsedType = exports.ZodParsedType = exports.objectUtil = exports.util = void 0;
var util;
(function (util) {
    util.assertEqual = (val) => val;
    function assertIs(_arg) { }
    util.assertIs = assertIs;
    function assertNever(_x) {
        throw new Error();
    }
    util.assertNever = assertNever;
    util.arrayToEnum = (items) => {
        const obj = {};
        for (const item of items) {
            obj[item] = item;
        }
        return obj;
    };
    util.getValidEnumValues = (obj) => {
        const validKeys = util.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
        const filtered = {};
        for (const k of validKeys) {
            filtered[k] = obj[k];
        }
        return util.objectValues(filtered);
    };
    util.objectValues = (obj) => {
        return util.objectKeys(obj).map(function (e) {
            return obj[e];
        });
    };
    util.objectKeys = typeof Object.keys === "function" // eslint-disable-line ban/ban
        ? (obj) => Object.keys(obj) // eslint-disable-line ban/ban
        : (object) => {
            const keys = [];
            for (const key in object) {
                if (Object.prototype.hasOwnProperty.call(object, key)) {
                    keys.push(key);
                }
            }
            return keys;
        };
    util.find = (arr, checker) => {
        for (const item of arr) {
            if (checker(item))
                return item;
        }
        return undefined;
    };
    util.isInteger = typeof Number.isInteger === "function"
        ? (val) => Number.isInteger(val) // eslint-disable-line ban/ban
        : (val) => typeof val === "number" && isFinite(val) && Math.floor(val) === val;
    function joinValues(array, separator = " | ") {
        return array
            .map((val) => (typeof val === "string" ? `'${val}'` : val))
            .join(separator);
    }
    util.joinValues = joinValues;
    util.jsonStringifyReplacer = (_, value) => {
        if (typeof value === "bigint") {
            return value.toString();
        }
        return value;
    };
})(util || (exports.util = util = {}));
var objectUtil;
(function (objectUtil) {
    objectUtil.mergeShapes = (first, second) => {
        return {
            ...first,
            ...second, // second overwrites first
        };
    };
})(objectUtil || (exports.objectUtil = objectUtil = {}));
exports.ZodParsedType = util.arrayToEnum([
    "string",
    "nan",
    "number",
    "integer",
    "float",
    "boolean",
    "date",
    "bigint",
    "symbol",
    "function",
    "undefined",
    "null",
    "array",
    "object",
    "unknown",
    "promise",
    "void",
    "never",
    "map",
    "set",
]);
const getParsedType = (data) => {
    const t = typeof data;
    switch (t) {
        case "undefined":
            return exports.ZodParsedType.undefined;
        case "string":
            return exports.ZodParsedType.string;
        case "number":
            return isNaN(data) ? exports.ZodParsedType.nan : exports.ZodParsedType.number;
        case "boolean":
            return exports.ZodParsedType.boolean;
        case "function":
            return exports.ZodParsedType.function;
        case "bigint":
            return exports.ZodParsedType.bigint;
        case "symbol":
            return exports.ZodParsedType.symbol;
        case "object":
            if (Array.isArray(data)) {
                return exports.ZodParsedType.array;
            }
            if (data === null) {
                return exports.ZodParsedType.null;
            }
            if (data.then &&
                typeof data.then === "function" &&
                data.catch &&
                typeof data.catch === "function") {
                return exports.ZodParsedType.promise;
            }
            if (typeof Map !== "undefined" && data instanceof Map) {
                return exports.ZodParsedType.map;
            }
            if (typeof Set !== "undefined" && data instanceof Set) {
                return exports.ZodParsedType.set;
            }
            if (typeof Date !== "undefined" && data instanceof Date) {
                return exports.ZodParsedType.date;
            }
            return exports.ZodParsedType.object;
        default:
            return exports.ZodParsedType.unknown;
    }
};
exports.getParsedType = getParsedType;

},
"node_modules/zod/lib/index.js":function(module,exports,__load){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined)
        k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function () { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function (o, m, k, k2) {
    if (k2 === undefined)
        k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function (o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule)
        return mod;
    var result = {};
    if (mod != null)
        for (var k in mod)
            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function (m, exports) {
    for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p))
            __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.z = void 0;
const z = __importStar(__load("node_modules/zod/lib/external.js"));
exports.z = z;
__exportStar(__load("node_modules/zod/lib/external.js"), exports);
exports.default = z;

},
"node_modules/zod/lib/locales/en.js":function(module,exports,__load){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __load("node_modules/zod/lib/helpers/util.js");
const ZodError_1 = __load("node_modules/zod/lib/ZodError.js");
const errorMap = (issue, _ctx) => {
    let message;
    switch (issue.code) {
        case ZodError_1.ZodIssueCode.invalid_type:
            if (issue.received === util_1.ZodParsedType.undefined) {
                message = "Required";
            }
            else {
                message = `Expected ${issue.expected}, received ${issue.received}`;
            }
            break;
        case ZodError_1.ZodIssueCode.invalid_literal:
            message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util_1.util.jsonStringifyReplacer)}`;
            break;
        case ZodError_1.ZodIssueCode.unrecognized_keys:
            message = `Unrecognized key(s) in object: ${util_1.util.joinValues(issue.keys, ", ")}`;
            break;
        case ZodError_1.ZodIssueCode.invalid_union:
            message = `Invalid input`;
            break;
        case ZodError_1.ZodIssueCode.invalid_union_discriminator:
            message = `Invalid discriminator value. Expected ${util_1.util.joinValues(issue.options)}`;
            break;
        case ZodError_1.ZodIssueCode.invalid_enum_value:
            message = `Invalid enum value. Expected ${util_1.util.joinValues(issue.options)}, received '${issue.received}'`;
            break;
        case ZodError_1.ZodIssueCode.invalid_arguments:
            message = `Invalid function arguments`;
            break;
        case ZodError_1.ZodIssueCode.invalid_return_type:
            message = `Invalid function return type`;
            break;
        case ZodError_1.ZodIssueCode.invalid_date:
            message = `Invalid date`;
            break;
        case ZodError_1.ZodIssueCode.invalid_string:
            if (typeof issue.validation === "object") {
                if ("includes" in issue.validation) {
                    message = `Invalid input: must include "${issue.validation.includes}"`;
                    if (typeof issue.validation.position === "number") {
                        message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
                    }
                }
                else if ("startsWith" in issue.validation) {
                    message = `Invalid input: must start with "${issue.validation.startsWith}"`;
                }
                else if ("endsWith" in issue.validation) {
                    message = `Invalid input: must end with "${issue.validation.endsWith}"`;
                }
                else {
                    util_1.util.assertNever(issue.validation);
                }
            }
            else if (issue.validation !== "regex") {
                message = `Invalid ${issue.validation}`;
            }
            else {
                message = "Invalid";
            }
            break;
        case ZodError_1.ZodIssueCode.too_small:
            if (issue.type === "array")
                message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
            else if (issue.type === "string")
                message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
            else if (issue.type === "number")
                message = `Number must be ${issue.exact
                    ? `exactly equal to `
                    : issue.inclusive
                        ? `greater than or equal to `
                        : `greater than `}${issue.minimum}`;
            else if (issue.type === "date")
                message = `Date must be ${issue.exact
                    ? `exactly equal to `
                    : issue.inclusive
                        ? `greater than or equal to `
                        : `greater than `}${new Date(Number(issue.minimum))}`;
            else
                message = "Invalid input";
            break;
        case ZodError_1.ZodIssueCode.too_big:
            if (issue.type === "array")
                message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
            else if (issue.type === "string")
                message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
            else if (issue.type === "number")
                message = `Number must be ${issue.exact
                    ? `exactly`
                    : issue.inclusive
                        ? `less than or equal to`
                        : `less than`} ${issue.maximum}`;
            else if (issue.type === "bigint")
                message = `BigInt must be ${issue.exact
                    ? `exactly`
                    : issue.inclusive
                        ? `less than or equal to`
                        : `less than`} ${issue.maximum}`;
            else if (issue.type === "date")
                message = `Date must be ${issue.exact
                    ? `exactly`
                    : issue.inclusive
                        ? `smaller than or equal to`
                        : `smaller than`} ${new Date(Number(issue.maximum))}`;
            else
                message = "Invalid input";
            break;
        case ZodError_1.ZodIssueCode.custom:
            message = `Invalid input`;
            break;
        case ZodError_1.ZodIssueCode.invalid_intersection_types:
            message = `Intersection results could not be merged`;
            break;
        case ZodError_1.ZodIssueCode.not_multiple_of:
            message = `Number must be a multiple of ${issue.multipleOf}`;
            break;
        case ZodError_1.ZodIssueCode.not_finite:
            message = "Number must be finite";
            break;
        default:
            message = _ctx.defaultError;
            util_1.util.assertNever(issue);
    }
    return { message };
};
exports.default = errorMap;

},
"node_modules/zod/lib/types.js":function(module,exports,__load){
"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m")
        throw new TypeError("Private method is not writable");
    if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _ZodEnum_cache, _ZodNativeEnum_cache;
Object.defineProperty(exports, "__esModule", { value: true });
exports.boolean = exports.bigint = exports.array = exports.any = exports.coerce = exports.ZodFirstPartyTypeKind = exports.late = exports.ZodSchema = exports.Schema = exports.custom = exports.ZodReadonly = exports.ZodPipeline = exports.ZodBranded = exports.BRAND = exports.ZodNaN = exports.ZodCatch = exports.ZodDefault = exports.ZodNullable = exports.ZodOptional = exports.ZodTransformer = exports.ZodEffects = exports.ZodPromise = exports.ZodNativeEnum = exports.ZodEnum = exports.ZodLiteral = exports.ZodLazy = exports.ZodFunction = exports.ZodSet = exports.ZodMap = exports.ZodRecord = exports.ZodTuple = exports.ZodIntersection = exports.ZodDiscriminatedUnion = exports.ZodUnion = exports.ZodObject = exports.ZodArray = exports.ZodVoid = exports.ZodNever = exports.ZodUnknown = exports.ZodAny = exports.ZodNull = exports.ZodUndefined = exports.ZodSymbol = exports.ZodDate = exports.ZodBoolean = exports.ZodBigInt = exports.ZodNumber = exports.ZodString = exports.datetimeRegex = exports.ZodType = void 0;
exports.NEVER = exports.void = exports.unknown = exports.union = exports.undefined = exports.tuple = exports.transformer = exports.symbol = exports.string = exports.strictObject = exports.set = exports.record = exports.promise = exports.preprocess = exports.pipeline = exports.ostring = exports.optional = exports.onumber = exports.oboolean = exports.object = exports.number = exports.nullable = exports.null = exports.never = exports.nativeEnum = exports.nan = exports.map = exports.literal = exports.lazy = exports.intersection = exports.instanceof = exports.function = exports.enum = exports.effect = exports.discriminatedUnion = exports.date = void 0;
const errors_1 = __load("node_modules/zod/lib/errors.js");
const errorUtil_1 = __load("node_modules/zod/lib/helpers/errorUtil.js");
const parseUtil_1 = __load("node_modules/zod/lib/helpers/parseUtil.js");
const util_1 = __load("node_modules/zod/lib/helpers/util.js");
const ZodError_1 = __load("node_modules/zod/lib/ZodError.js");
class ParseInputLazyPath {
    constructor(parent, value, path, key) {
        this._cachedPath = [];
        this.parent = parent;
        this.data = value;
        this._path = path;
        this._key = key;
    }
    get path() {
        if (!this._cachedPath.length) {
            if (this._key instanceof Array) {
                this._cachedPath.push(...this._path, ...this._key);
            }
            else {
                this._cachedPath.push(...this._path, this._key);
            }
        }
        return this._cachedPath;
    }
}
const handleResult = (ctx, result) => {
    if ((0, parseUtil_1.isValid)(result)) {
        return { success: true, data: result.value };
    }
    else {
        if (!ctx.common.issues.length) {
            throw new Error("Validation failed but no issues detected.");
        }
        return {
            success: false,
            get error() {
                if (this._error)
                    return this._error;
                const error = new ZodError_1.ZodError(ctx.common.issues);
                this._error = error;
                return this._error;
            },
        };
    }
};
function processCreateParams(params) {
    if (!params)
        return {};
    const { errorMap, invalid_type_error, required_error, description } = params;
    if (errorMap && (invalid_type_error || required_error)) {
        throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
    }
    if (errorMap)
        return { errorMap: errorMap, description };
    const customMap = (iss, ctx) => {
        var _a, _b;
        const { message } = params;
        if (iss.code === "invalid_enum_value") {
            return { message: message !== null && message !== void 0 ? message : ctx.defaultError };
        }
        if (typeof ctx.data === "undefined") {
            return { message: (_a = message !== null && message !== void 0 ? message : required_error) !== null && _a !== void 0 ? _a : ctx.defaultError };
        }
        if (iss.code !== "invalid_type")
            return { message: ctx.defaultError };
        return { message: (_b = message !== null && message !== void 0 ? message : invalid_type_error) !== null && _b !== void 0 ? _b : ctx.defaultError };
    };
    return { errorMap: customMap, description };
}
class ZodType {
    get description() {
        return this._def.description;
    }
    _getType(input) {
        return (0, util_1.getParsedType)(input.data);
    }
    _getOrReturnCtx(input, ctx) {
        return (ctx || {
            common: input.parent.common,
            data: input.data,
            parsedType: (0, util_1.getParsedType)(input.data),
            schemaErrorMap: this._def.errorMap,
            path: input.path,
            parent: input.parent,
        });
    }
    _processInputParams(input) {
        return {
            status: new parseUtil_1.ParseStatus(),
            ctx: {
                common: input.parent.common,
                data: input.data,
                parsedType: (0, util_1.getParsedType)(input.data),
                schemaErrorMap: this._def.errorMap,
                path: input.path,
                parent: input.parent,
            },
        };
    }
    _parseSync(input) {
        const result = this._parse(input);
        if ((0, parseUtil_1.isAsync)(result)) {
            throw new Error("Synchronous parse encountered promise.");
        }
        return result;
    }
    _parseAsync(input) {
        const result = this._parse(input);
        return Promise.resolve(result);
    }
    parse(data, params) {
        const result = this.safeParse(data, params);
        if (result.success)
            return result.data;
        throw result.error;
    }
    safeParse(data, params) {
        var _a;
        const ctx = {
            common: {
                issues: [],
                async: (_a = params === null || params === void 0 ? void 0 : params.async) !== null && _a !== void 0 ? _a : false,
                contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap,
            },
            path: (params === null || params === void 0 ? void 0 : params.path) || [],
            schemaErrorMap: this._def.errorMap,
            parent: null,
            data,
            parsedType: (0, util_1.getParsedType)(data),
        };
        const result = this._parseSync({ data, path: ctx.path, parent: ctx });
        return handleResult(ctx, result);
    }
    "~validate"(data) {
        var _a, _b;
        const ctx = {
            common: {
                issues: [],
                async: !!this["~standard"].async,
            },
            path: [],
            schemaErrorMap: this._def.errorMap,
            parent: null,
            data,
            parsedType: (0, util_1.getParsedType)(data),
        };
        if (!this["~standard"].async) {
            try {
                const result = this._parseSync({ data, path: [], parent: ctx });
                return (0, parseUtil_1.isValid)(result)
                    ? {
                        value: result.value,
                    }
                    : {
                        issues: ctx.common.issues,
                    };
            }
            catch (err) {
                if ((_b = (_a = err === null || err === void 0 ? void 0 : err.message) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.includes("encountered")) {
                    this["~standard"].async = true;
                }
                ctx.common = {
                    issues: [],
                    async: true,
                };
            }
        }
        return this._parseAsync({ data, path: [], parent: ctx }).then((result) => (0, parseUtil_1.isValid)(result)
            ? {
                value: result.value,
            }
            : {
                issues: ctx.common.issues,
            });
    }
    async parseAsync(data, params) {
        const result = await this.safeParseAsync(data, params);
        if (result.success)
            return result.data;
        throw result.error;
    }
    async safeParseAsync(data, params) {
        const ctx = {
            common: {
                issues: [],
                contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap,
                async: true,
            },
            path: (params === null || params === void 0 ? void 0 : params.path) || [],
            schemaErrorMap: this._def.errorMap,
            parent: null,
            data,
            parsedType: (0, util_1.getParsedType)(data),
        };
        const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
        const result = await ((0, parseUtil_1.isAsync)(maybeAsyncResult)
            ? maybeAsyncResult
            : Promise.resolve(maybeAsyncResult));
        return handleResult(ctx, result);
    }
    refine(check, message) {
        const getIssueProperties = (val) => {
            if (typeof message === "string" || typeof message === "undefined") {
                return { message };
            }
            else if (typeof message === "function") {
                return message(val);
            }
            else {
                return message;
            }
        };
        return this._refinement((val, ctx) => {
            const result = check(val);
            const setError = () => ctx.addIssue({
                code: ZodError_1.ZodIssueCode.custom,
                ...getIssueProperties(val),
            });
            if (typeof Promise !== "undefined" && result instanceof Promise) {
                return result.then((data) => {
                    if (!data) {
                        setError();
                        return false;
                    }
                    else {
                        return true;
                    }
                });
            }
            if (!result) {
                setError();
                return false;
            }
            else {
                return true;
            }
        });
    }
    refinement(check, refinementData) {
        return this._refinement((val, ctx) => {
            if (!check(val)) {
                ctx.addIssue(typeof refinementData === "function"
                    ? refinementData(val, ctx)
                    : refinementData);
                return false;
            }
            else {
                return true;
            }
        });
    }
    _refinement(refinement) {
        return new ZodEffects({
            schema: this,
            typeName: ZodFirstPartyTypeKind.ZodEffects,
            effect: { type: "refinement", refinement },
        });
    }
    superRefine(refinement) {
        return this._refinement(refinement);
    }
    constructor(def) {
        /** Alias of safeParseAsync */
        this.spa = this.safeParseAsync;
        this._def = def;
        this.parse = this.parse.bind(this);
        this.safeParse = this.safeParse.bind(this);
        this.parseAsync = this.parseAsync.bind(this);
        this.safeParseAsync = this.safeParseAsync.bind(this);
        this.spa = this.spa.bind(this);
        this.refine = this.refine.bind(this);
        this.refinement = this.refinement.bind(this);
        this.superRefine = this.superRefine.bind(this);
        this.optional = this.optional.bind(this);
        this.nullable = this.nullable.bind(this);
        this.nullish = this.nullish.bind(this);
        this.array = this.array.bind(this);
        this.promise = this.promise.bind(this);
        this.or = this.or.bind(this);
        this.and = this.and.bind(this);
        this.transform = this.transform.bind(this);
        this.brand = this.brand.bind(this);
        this.default = this.default.bind(this);
        this.catch = this.catch.bind(this);
        this.describe = this.describe.bind(this);
        this.pipe = this.pipe.bind(this);
        this.readonly = this.readonly.bind(this);
        this.isNullable = this.isNullable.bind(this);
        this.isOptional = this.isOptional.bind(this);
        this["~standard"] = {
            version: 1,
            vendor: "zod",
            validate: (data) => this["~validate"](data),
        };
    }
    optional() {
        return ZodOptional.create(this, this._def);
    }
    nullable() {
        return ZodNullable.create(this, this._def);
    }
    nullish() {
        return this.nullable().optional();
    }
    array() {
        return ZodArray.create(this);
    }
    promise() {
        return ZodPromise.create(this, this._def);
    }
    or(option) {
        return ZodUnion.create([this, option], this._def);
    }
    and(incoming) {
        return ZodIntersection.create(this, incoming, this._def);
    }
    transform(transform) {
        return new ZodEffects({
            ...processCreateParams(this._def),
            schema: this,
            typeName: ZodFirstPartyTypeKind.ZodEffects,
            effect: { type: "transform", transform },
        });
    }
    default(def) {
        const defaultValueFunc = typeof def === "function" ? def : () => def;
        return new ZodDefault({
            ...processCreateParams(this._def),
            innerType: this,
            defaultValue: defaultValueFunc,
            typeName: ZodFirstPartyTypeKind.ZodDefault,
        });
    }
    brand() {
        return new ZodBranded({
            typeName: ZodFirstPartyTypeKind.ZodBranded,
            type: this,
            ...processCreateParams(this._def),
        });
    }
    catch(def) {
        const catchValueFunc = typeof def === "function" ? def : () => def;
        return new ZodCatch({
            ...processCreateParams(this._def),
            innerType: this,
            catchValue: catchValueFunc,
            typeName: ZodFirstPartyTypeKind.ZodCatch,
        });
    }
    describe(description) {
        const This = this.constructor;
        return new This({
            ...this._def,
            description,
        });
    }
    pipe(target) {
        return ZodPipeline.create(this, target);
    }
    readonly() {
        return ZodReadonly.create(this);
    }
    isOptional() {
        return this.safeParse(undefined).success;
    }
    isNullable() {
        return this.safeParse(null).success;
    }
}
exports.ZodType = ZodType;
exports.Schema = ZodType;
exports.ZodSchema = ZodType;
const cuidRegex = /^c[^\s-]{8,}$/i;
const cuid2Regex = /^[0-9a-z]+$/;
const ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
// const uuidRegex =
//   /^([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}|00000000-0000-0000-0000-000000000000)$/i;
const uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
const nanoidRegex = /^[a-z0-9_-]{21}$/i;
const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
const durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
// from https://stackoverflow.com/a/46181/1550155
// old version: too slow, didn't support unicode
// const emailRegex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
//old email regex
// const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@((?!-)([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{1,})[^-<>()[\].,;:\s@"]$/i;
// eslint-disable-next-line
// const emailRegex =
//   /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\])|(\[IPv6:(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))\])|([A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])*(\.[A-Za-z]{2,})+))$/;
// const emailRegex =
//   /^[a-zA-Z0-9\.\!\#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\~\-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
// const emailRegex =
//   /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
const emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
// const emailRegex =
//   /^[a-z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9\-]+)*$/i;
// from https://thekevinscott.com/emojis-in-javascript/#writing-a-regular-expression
const _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
let emojiRegex;
// faster, simpler, safer
const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
const ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
// const ipv6Regex =
// /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/;
const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
const ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
// https://stackoverflow.com/questions/7860392/determine-if-string-is-in-base64-using-javascript
const base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
// https://base64.guru/standards/base64url
const base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
// simple
// const dateRegexSource = `\\d{4}-\\d{2}-\\d{2}`;
// no leap year validation
// const dateRegexSource = `\\d{4}-((0[13578]|10|12)-31|(0[13-9]|1[0-2])-30|(0[1-9]|1[0-2])-(0[1-9]|1\\d|2\\d))`;
// with leap year validation
const dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
const dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
    // let regex = `\\d{2}:\\d{2}:\\d{2}`;
    let regex = `([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d`;
    if (args.precision) {
        regex = `${regex}\\.\\d{${args.precision}}`;
    }
    else if (args.precision == null) {
        regex = `${regex}(\\.\\d+)?`;
    }
    return regex;
}
function timeRegex(args) {
    return new RegExp(`^${timeRegexSource(args)}$`);
}
// Adapted from https://stackoverflow.com/a/3143231
function datetimeRegex(args) {
    let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
    const opts = [];
    opts.push(args.local ? `Z?` : `Z`);
    if (args.offset)
        opts.push(`([+-]\\d{2}:?\\d{2})`);
    regex = `${regex}(${opts.join("|")})`;
    return new RegExp(`^${regex}$`);
}
exports.datetimeRegex = datetimeRegex;
function isValidIP(ip, version) {
    if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
        return true;
    }
    if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
        return true;
    }
    return false;
}
function isValidJWT(jwt, alg) {
    if (!jwtRegex.test(jwt))
        return false;
    try {
        const [header] = jwt.split(".");
        // Convert base64url to base64
        const base64 = header
            .replace(/-/g, "+")
            .replace(/_/g, "/")
            .padEnd(header.length + ((4 - (header.length % 4)) % 4), "=");
        const decoded = JSON.parse(atob(base64));
        if (typeof decoded !== "object" || decoded === null)
            return false;
        if (!decoded.typ || !decoded.alg)
            return false;
        if (alg && decoded.alg !== alg)
            return false;
        return true;
    }
    catch (_a) {
        return false;
    }
}
function isValidCidr(ip, version) {
    if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
        return true;
    }
    if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
        return true;
    }
    return false;
}
class ZodString extends ZodType {
    _parse(input) {
        if (this._def.coerce) {
            input.data = String(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== util_1.ZodParsedType.string) {
            const ctx = this._getOrReturnCtx(input);
            (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.string,
                received: ctx.parsedType,
            });
            return parseUtil_1.INVALID;
        }
        const status = new parseUtil_1.ParseStatus();
        let ctx = undefined;
        for (const check of this._def.checks) {
            if (check.kind === "min") {
                if (input.data.length < check.value) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                        code: ZodError_1.ZodIssueCode.too_small,
                        minimum: check.value,
                        type: "string",
                        inclusive: true,
                        exact: false,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "max") {
                if (input.data.length > check.value) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                        code: ZodError_1.ZodIssueCode.too_big,
                        maximum: check.value,
                        type: "string",
                        inclusive: true,
                        exact: false,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "length") {
                const tooBig = input.data.length > check.value;
                const tooSmall = input.data.length < check.value;
                if (tooBig || tooSmall) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    if (tooBig) {
                        (0, parseUtil_1.addIssueToContext)(ctx, {
                            code: ZodError_1.ZodIssueCode.too_big,
                            maximum: check.value,
                            type: "string",
                            inclusive: true,
                            exact: true,
                            message: check.message,
                        });
                    }
                    else if (tooSmall) {
                        (0, parseUtil_1.addIssueToContext)(ctx, {
                            code: ZodError_1.ZodIssueCode.too_small,
                            minimum: check.value,
                            type: "string",
                            inclusive: true,
                            exact: true,
                            message: check.message,
                        });
                    }
                    status.dirty();
                }
            }
            else if (check.kind === "email") {
                if (!emailRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                        validation: "email",
                        code: ZodError_1.ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "emoji") {
                if (!emojiRegex) {
                    emojiRegex = new RegExp(_emojiRegex, "u");
                }
                if (!emojiRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                        validation: "emoji",
                        code: ZodError_1.ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "uuid") {
                if (!uuidRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                        validation: "uuid",
                        code: ZodError_1.ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "nanoid") {
                if (!nanoidRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                        validation: "nanoid",
                        code: ZodError_1.ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "cuid") {
                if (!cuidRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                        validation: "cuid",
                        code: ZodError_1.ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "cuid2") {
                if (!cuid2Regex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                        validation: "cuid2",
                        code: ZodError_1.ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "ulid") {
                if (!ulidRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                        validation: "ulid",
                        code: ZodError_1.ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "url") {
                try {
                    new URL(input.data);
                }
                catch (_a) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                        validation: "url",
                        code: ZodError_1.ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "regex") {
                check.regex.lastIndex = 0;
                const testResult = check.regex.test(input.data);
                if (!testResult) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                        validation: "regex",
                        code: ZodError_1.ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "trim") {
                input.data = input.data.trim();
            }
            else if (check.kind === "includes") {
                if (!input.data.includes(check.value, check.position)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                        code: ZodError_1.ZodIssueCode.invalid_string,
                        validation: { includes: check.value, position: check.position },
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "toLowerCase") {
                input.data = input.data.toLowerCase();
            }
            else if (check.kind === "toUpperCase") {
                input.data = input.data.toUpperCase();
            }
            else if (check.kind === "startsWith") {
                if (!input.data.startsWith(check.value)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                        code: ZodError_1.ZodIssueCode.invalid_string,
                        validation: { startsWith: check.value },
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "endsWith") {
                if (!input.data.endsWith(check.value)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                        code: ZodError_1.ZodIssueCode.invalid_string,
                        validation: { endsWith: check.value },
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "datetime") {
                const regex = datetimeRegex(check);
                if (!regex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                        code: ZodError_1.ZodIssueCode.invalid_string,
                        validation: "datetime",
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "date") {
                const regex = dateRegex;
                if (!regex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                        code: ZodError_1.ZodIssueCode.invalid_string,
                        validation: "date",
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "time") {
                const regex = timeRegex(check);
                if (!regex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                        code: ZodError_1.ZodIssueCode.invalid_string,
                        validation: "time",
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "duration") {
                if (!durationRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                        validation: "duration",
                        code: ZodError_1.ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "ip") {
                if (!isValidIP(input.data, check.version)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                        validation: "ip",
                        code: ZodError_1.ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "jwt") {
                if (!isValidJWT(input.data, check.alg)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                        validation: "jwt",
                        code: ZodError_1.ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "cidr") {
                if (!isValidCidr(input.data, check.version)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                        validation: "cidr",
                        code: ZodError_1.ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "base64") {
                if (!base64Regex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                        validation: "base64",
                        code: ZodError_1.ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "base64url") {
                if (!base64urlRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                        validation: "base64url",
                        code: ZodError_1.ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else {
                util_1.util.assertNever(check);
            }
        }
        return { status: status.value, value: input.data };
    }
    _regex(regex, validation, message) {
        return this.refinement((data) => regex.test(data), {
            validation,
            code: ZodError_1.ZodIssueCode.invalid_string,
            ...errorUtil_1.errorUtil.errToObj(message),
        });
    }
    _addCheck(check) {
        return new ZodString({
            ...this._def,
            checks: [...this._def.checks, check],
        });
    }
    email(message) {
        return this._addCheck({ kind: "email", ...errorUtil_1.errorUtil.errToObj(message) });
    }
    url(message) {
        return this._addCheck({ kind: "url", ...errorUtil_1.errorUtil.errToObj(message) });
    }
    emoji(message) {
        return this._addCheck({ kind: "emoji", ...errorUtil_1.errorUtil.errToObj(message) });
    }
    uuid(message) {
        return this._addCheck({ kind: "uuid", ...errorUtil_1.errorUtil.errToObj(message) });
    }
    nanoid(message) {
        return this._addCheck({ kind: "nanoid", ...errorUtil_1.errorUtil.errToObj(message) });
    }
    cuid(message) {
        return this._addCheck({ kind: "cuid", ...errorUtil_1.errorUtil.errToObj(message) });
    }
    cuid2(message) {
        return this._addCheck({ kind: "cuid2", ...errorUtil_1.errorUtil.errToObj(message) });
    }
    ulid(message) {
        return this._addCheck({ kind: "ulid", ...errorUtil_1.errorUtil.errToObj(message) });
    }
    base64(message) {
        return this._addCheck({ kind: "base64", ...errorUtil_1.errorUtil.errToObj(message) });
    }
    base64url(message) {
        // base64url encoding is a modification of base64 that can safely be used in URLs and filenames
        return this._addCheck({
            kind: "base64url",
            ...errorUtil_1.errorUtil.errToObj(message),
        });
    }
    jwt(options) {
        return this._addCheck({ kind: "jwt", ...errorUtil_1.errorUtil.errToObj(options) });
    }
    ip(options) {
        return this._addCheck({ kind: "ip", ...errorUtil_1.errorUtil.errToObj(options) });
    }
    cidr(options) {
        return this._addCheck({ kind: "cidr", ...errorUtil_1.errorUtil.errToObj(options) });
    }
    datetime(options) {
        var _a, _b;
        if (typeof options === "string") {
            return this._addCheck({
                kind: "datetime",
                precision: null,
                offset: false,
                local: false,
                message: options,
            });
        }
        return this._addCheck({
            kind: "datetime",
            precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
            offset: (_a = options === null || options === void 0 ? void 0 : options.offset) !== null && _a !== void 0 ? _a : false,
            local: (_b = options === null || options === void 0 ? void 0 : options.local) !== null && _b !== void 0 ? _b : false,
            ...errorUtil_1.errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message),
        });
    }
    date(message) {
        return this._addCheck({ kind: "date", message });
    }
    time(options) {
        if (typeof options === "string") {
            return this._addCheck({
                kind: "time",
                precision: null,
                message: options,
            });
        }
        return this._addCheck({
            kind: "time",
            precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
            ...errorUtil_1.errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message),
        });
    }
    duration(message) {
        return this._addCheck({ kind: "duration", ...errorUtil_1.errorUtil.errToObj(message) });
    }
    regex(regex, message) {
        return this._addCheck({
            kind: "regex",
            regex: regex,
            ...errorUtil_1.errorUtil.errToObj(message),
        });
    }
    includes(value, options) {
        return this._addCheck({
            kind: "includes",
            value: value,
            position: options === null || options === void 0 ? void 0 : options.position,
            ...errorUtil_1.errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message),
        });
    }
    startsWith(value, message) {
        return this._addCheck({
            kind: "startsWith",
            value: value,
            ...errorUtil_1.errorUtil.errToObj(message),
        });
    }
    endsWith(value, message) {
        return this._addCheck({
            kind: "endsWith",
            value: value,
            ...errorUtil_1.errorUtil.errToObj(message),
        });
    }
    min(minLength, message) {
        return this._addCheck({
            kind: "min",
            value: minLength,
            ...errorUtil_1.errorUtil.errToObj(message),
        });
    }
    max(maxLength, message) {
        return this._addCheck({
            kind: "max",
            value: maxLength,
            ...errorUtil_1.errorUtil.errToObj(message),
        });
    }
    length(len, message) {
        return this._addCheck({
            kind: "length",
            value: len,
            ...errorUtil_1.errorUtil.errToObj(message),
        });
    }
    /**
     * Equivalent to `.min(1)`
     */
    nonempty(message) {
        return this.min(1, errorUtil_1.errorUtil.errToObj(message));
    }
    trim() {
        return new ZodString({
            ...this._def,
            checks: [...this._def.checks, { kind: "trim" }],
        });
    }
    toLowerCase() {
        return new ZodString({
            ...this._def,
            checks: [...this._def.checks, { kind: "toLowerCase" }],
        });
    }
    toUpperCase() {
        return new ZodString({
            ...this._def,
            checks: [...this._def.checks, { kind: "toUpperCase" }],
        });
    }
    get isDatetime() {
        return !!this._def.checks.find((ch) => ch.kind === "datetime");
    }
    get isDate() {
        return !!this._def.checks.find((ch) => ch.kind === "date");
    }
    get isTime() {
        return !!this._def.checks.find((ch) => ch.kind === "time");
    }
    get isDuration() {
        return !!this._def.checks.find((ch) => ch.kind === "duration");
    }
    get isEmail() {
        return !!this._def.checks.find((ch) => ch.kind === "email");
    }
    get isURL() {
        return !!this._def.checks.find((ch) => ch.kind === "url");
    }
    get isEmoji() {
        return !!this._def.checks.find((ch) => ch.kind === "emoji");
    }
    get isUUID() {
        return !!this._def.checks.find((ch) => ch.kind === "uuid");
    }
    get isNANOID() {
        return !!this._def.checks.find((ch) => ch.kind === "nanoid");
    }
    get isCUID() {
        return !!this._def.checks.find((ch) => ch.kind === "cuid");
    }
    get isCUID2() {
        return !!this._def.checks.find((ch) => ch.kind === "cuid2");
    }
    get isULID() {
        return !!this._def.checks.find((ch) => ch.kind === "ulid");
    }
    get isIP() {
        return !!this._def.checks.find((ch) => ch.kind === "ip");
    }
    get isCIDR() {
        return !!this._def.checks.find((ch) => ch.kind === "cidr");
    }
    get isBase64() {
        return !!this._def.checks.find((ch) => ch.kind === "base64");
    }
    get isBase64url() {
        // base64url encoding is a modification of base64 that can safely be used in URLs and filenames
        return !!this._def.checks.find((ch) => ch.kind === "base64url");
    }
    get minLength() {
        let min = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "min") {
                if (min === null || ch.value > min)
                    min = ch.value;
            }
        }
        return min;
    }
    get maxLength() {
        let max = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "max") {
                if (max === null || ch.value < max)
                    max = ch.value;
            }
        }
        return max;
    }
}
exports.ZodString = ZodString;
ZodString.create = (params) => {
    var _a;
    return new ZodString({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodString,
        coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
        ...processCreateParams(params),
    });
};
// https://stackoverflow.com/questions/3966484/why-does-modulus-operator-return-fractional-number-in-javascript/31711034#31711034
function floatSafeRemainder(val, step) {
    const valDecCount = (val.toString().split(".")[1] || "").length;
    const stepDecCount = (step.toString().split(".")[1] || "").length;
    const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
    const valInt = parseInt(val.toFixed(decCount).replace(".", ""));
    const stepInt = parseInt(step.toFixed(decCount).replace(".", ""));
    return (valInt % stepInt) / Math.pow(10, decCount);
}
class ZodNumber extends ZodType {
    constructor() {
        super(...arguments);
        this.min = this.gte;
        this.max = this.lte;
        this.step = this.multipleOf;
    }
    _parse(input) {
        if (this._def.coerce) {
            input.data = Number(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== util_1.ZodParsedType.number) {
            const ctx = this._getOrReturnCtx(input);
            (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.number,
                received: ctx.parsedType,
            });
            return parseUtil_1.INVALID;
        }
        let ctx = undefined;
        const status = new parseUtil_1.ParseStatus();
        for (const check of this._def.checks) {
            if (check.kind === "int") {
                if (!util_1.util.isInteger(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                        code: ZodError_1.ZodIssueCode.invalid_type,
                        expected: "integer",
                        received: "float",
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "min") {
                const tooSmall = check.inclusive
                    ? input.data < check.value
                    : input.data <= check.value;
                if (tooSmall) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                        code: ZodError_1.ZodIssueCode.too_small,
                        minimum: check.value,
                        type: "number",
                        inclusive: check.inclusive,
                        exact: false,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "max") {
                const tooBig = check.inclusive
                    ? input.data > check.value
                    : input.data >= check.value;
                if (tooBig) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                        code: ZodError_1.ZodIssueCode.too_big,
                        maximum: check.value,
                        type: "number",
                        inclusive: check.inclusive,
                        exact: false,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "multipleOf") {
                if (floatSafeRemainder(input.data, check.value) !== 0) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                        code: ZodError_1.ZodIssueCode.not_multiple_of,
                        multipleOf: check.value,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "finite") {
                if (!Number.isFinite(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                        code: ZodError_1.ZodIssueCode.not_finite,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else {
                util_1.util.assertNever(check);
            }
        }
        return { status: status.value, value: input.data };
    }
    gte(value, message) {
        return this.setLimit("min", value, true, errorUtil_1.errorUtil.toString(message));
    }
    gt(value, message) {
        return this.setLimit("min", value, false, errorUtil_1.errorUtil.toString(message));
    }
    lte(value, message) {
        return this.setLimit("max", value, true, errorUtil_1.errorUtil.toString(message));
    }
    lt(value, message) {
        return this.setLimit("max", value, false, errorUtil_1.errorUtil.toString(message));
    }
    setLimit(kind, value, inclusive, message) {
        return new ZodNumber({
            ...this._def,
            checks: [
                ...this._def.checks,
                {
                    kind,
                    value,
                    inclusive,
                    message: errorUtil_1.errorUtil.toString(message),
                },
            ],
        });
    }
    _addCheck(check) {
        return new ZodNumber({
            ...this._def,
            checks: [...this._def.checks, check],
        });
    }
    int(message) {
        return this._addCheck({
            kind: "int",
            message: errorUtil_1.errorUtil.toString(message),
        });
    }
    positive(message) {
        return this._addCheck({
            kind: "min",
            value: 0,
            inclusive: false,
            message: errorUtil_1.errorUtil.toString(message),
        });
    }
    negative(message) {
        return this._addCheck({
            kind: "max",
            value: 0,
            inclusive: false,
            message: errorUtil_1.errorUtil.toString(message),
        });
    }
    nonpositive(message) {
        return this._addCheck({
            kind: "max",
            value: 0,
            inclusive: true,
            message: errorUtil_1.errorUtil.toString(message),
        });
    }
    nonnegative(message) {
        return this._addCheck({
            kind: "min",
            value: 0,
            inclusive: true,
            message: errorUtil_1.errorUtil.toString(message),
        });
    }
    multipleOf(value, message) {
        return this._addCheck({
            kind: "multipleOf",
            value: value,
            message: errorUtil_1.errorUtil.toString(message),
        });
    }
    finite(message) {
        return this._addCheck({
            kind: "finite",
            message: errorUtil_1.errorUtil.toString(message),
        });
    }
    safe(message) {
        return this._addCheck({
            kind: "min",
            inclusive: true,
            value: Number.MIN_SAFE_INTEGER,
            message: errorUtil_1.errorUtil.toString(message),
        })._addCheck({
            kind: "max",
            inclusive: true,
            value: Number.MAX_SAFE_INTEGER,
            message: errorUtil_1.errorUtil.toString(message),
        });
    }
    get minValue() {
        let min = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "min") {
                if (min === null || ch.value > min)
                    min = ch.value;
            }
        }
        return min;
    }
    get maxValue() {
        let max = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "max") {
                if (max === null || ch.value < max)
                    max = ch.value;
            }
        }
        return max;
    }
    get isInt() {
        return !!this._def.checks.find((ch) => ch.kind === "int" ||
            (ch.kind === "multipleOf" && util_1.util.isInteger(ch.value)));
    }
    get isFinite() {
        let max = null, min = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "finite" ||
                ch.kind === "int" ||
                ch.kind === "multipleOf") {
                return true;
            }
            else if (ch.kind === "min") {
                if (min === null || ch.value > min)
                    min = ch.value;
            }
            else if (ch.kind === "max") {
                if (max === null || ch.value < max)
                    max = ch.value;
            }
        }
        return Number.isFinite(min) && Number.isFinite(max);
    }
}
exports.ZodNumber = ZodNumber;
ZodNumber.create = (params) => {
    return new ZodNumber({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodNumber,
        coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
        ...processCreateParams(params),
    });
};
class ZodBigInt extends ZodType {
    constructor() {
        super(...arguments);
        this.min = this.gte;
        this.max = this.lte;
    }
    _parse(input) {
        if (this._def.coerce) {
            try {
                input.data = BigInt(input.data);
            }
            catch (_a) {
                return this._getInvalidInput(input);
            }
        }
        const parsedType = this._getType(input);
        if (parsedType !== util_1.ZodParsedType.bigint) {
            return this._getInvalidInput(input);
        }
        let ctx = undefined;
        const status = new parseUtil_1.ParseStatus();
        for (const check of this._def.checks) {
            if (check.kind === "min") {
                const tooSmall = check.inclusive
                    ? input.data < check.value
                    : input.data <= check.value;
                if (tooSmall) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                        code: ZodError_1.ZodIssueCode.too_small,
                        type: "bigint",
                        minimum: check.value,
                        inclusive: check.inclusive,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "max") {
                const tooBig = check.inclusive
                    ? input.data > check.value
                    : input.data >= check.value;
                if (tooBig) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                        code: ZodError_1.ZodIssueCode.too_big,
                        type: "bigint",
                        maximum: check.value,
                        inclusive: check.inclusive,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "multipleOf") {
                if (input.data % check.value !== BigInt(0)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                        code: ZodError_1.ZodIssueCode.not_multiple_of,
                        multipleOf: check.value,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else {
                util_1.util.assertNever(check);
            }
        }
        return { status: status.value, value: input.data };
    }
    _getInvalidInput(input) {
        const ctx = this._getOrReturnCtx(input);
        (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.bigint,
            received: ctx.parsedType,
        });
        return parseUtil_1.INVALID;
    }
    gte(value, message) {
        return this.setLimit("min", value, true, errorUtil_1.errorUtil.toString(message));
    }
    gt(value, message) {
        return this.setLimit("min", value, false, errorUtil_1.errorUtil.toString(message));
    }
    lte(value, message) {
        return this.setLimit("max", value, true, errorUtil_1.errorUtil.toString(message));
    }
    lt(value, message) {
        return this.setLimit("max", value, false, errorUtil_1.errorUtil.toString(message));
    }
    setLimit(kind, value, inclusive, message) {
        return new ZodBigInt({
            ...this._def,
            checks: [
                ...this._def.checks,
                {
                    kind,
                    value,
                    inclusive,
                    message: errorUtil_1.errorUtil.toString(message),
                },
            ],
        });
    }
    _addCheck(check) {
        return new ZodBigInt({
            ...this._def,
            checks: [...this._def.checks, check],
        });
    }
    positive(message) {
        return this._addCheck({
            kind: "min",
            value: BigInt(0),
            inclusive: false,
            message: errorUtil_1.errorUtil.toString(message),
        });
    }
    negative(message) {
        return this._addCheck({
            kind: "max",
            value: BigInt(0),
            inclusive: false,
            message: errorUtil_1.errorUtil.toString(message),
        });
    }
    nonpositive(message) {
        return this._addCheck({
            kind: "max",
            value: BigInt(0),
            inclusive: true,
            message: errorUtil_1.errorUtil.toString(message),
        });
    }
    nonnegative(message) {
        return this._addCheck({
            kind: "min",
            value: BigInt(0),
            inclusive: true,
            message: errorUtil_1.errorUtil.toString(message),
        });
    }
    multipleOf(value, message) {
        return this._addCheck({
            kind: "multipleOf",
            value,
            message: errorUtil_1.errorUtil.toString(message),
        });
    }
    get minValue() {
        let min = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "min") {
                if (min === null || ch.value > min)
                    min = ch.value;
            }
        }
        return min;
    }
    get maxValue() {
        let max = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "max") {
                if (max === null || ch.value < max)
                    max = ch.value;
            }
        }
        return max;
    }
}
exports.ZodBigInt = ZodBigInt;
ZodBigInt.create = (params) => {
    var _a;
    return new ZodBigInt({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodBigInt,
        coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
        ...processCreateParams(params),
    });
};
class ZodBoolean extends ZodType {
    _parse(input) {
        if (this._def.coerce) {
            input.data = Boolean(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== util_1.ZodParsedType.boolean) {
            const ctx = this._getOrReturnCtx(input);
            (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.boolean,
                received: ctx.parsedType,
            });
            return parseUtil_1.INVALID;
        }
        return (0, parseUtil_1.OK)(input.data);
    }
}
exports.ZodBoolean = ZodBoolean;
ZodBoolean.create = (params) => {
    return new ZodBoolean({
        typeName: ZodFirstPartyTypeKind.ZodBoolean,
        coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
        ...processCreateParams(params),
    });
};
class ZodDate extends ZodType {
    _parse(input) {
        if (this._def.coerce) {
            input.data = new Date(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== util_1.ZodParsedType.date) {
            const ctx = this._getOrReturnCtx(input);
            (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.date,
                received: ctx.parsedType,
            });
            return parseUtil_1.INVALID;
        }
        if (isNaN(input.data.getTime())) {
            const ctx = this._getOrReturnCtx(input);
            (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_date,
            });
            return parseUtil_1.INVALID;
        }
        const status = new parseUtil_1.ParseStatus();
        let ctx = undefined;
        for (const check of this._def.checks) {
            if (check.kind === "min") {
                if (input.data.getTime() < check.value) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                        code: ZodError_1.ZodIssueCode.too_small,
                        message: check.message,
                        inclusive: true,
                        exact: false,
                        minimum: check.value,
                        type: "date",
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "max") {
                if (input.data.getTime() > check.value) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                        code: ZodError_1.ZodIssueCode.too_big,
                        message: check.message,
                        inclusive: true,
                        exact: false,
                        maximum: check.value,
                        type: "date",
                    });
                    status.dirty();
                }
            }
            else {
                util_1.util.assertNever(check);
            }
        }
        return {
            status: status.value,
            value: new Date(input.data.getTime()),
        };
    }
    _addCheck(check) {
        return new ZodDate({
            ...this._def,
            checks: [...this._def.checks, check],
        });
    }
    min(minDate, message) {
        return this._addCheck({
            kind: "min",
            value: minDate.getTime(),
            message: errorUtil_1.errorUtil.toString(message),
        });
    }
    max(maxDate, message) {
        return this._addCheck({
            kind: "max",
            value: maxDate.getTime(),
            message: errorUtil_1.errorUtil.toString(message),
        });
    }
    get minDate() {
        let min = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "min") {
                if (min === null || ch.value > min)
                    min = ch.value;
            }
        }
        return min != null ? new Date(min) : null;
    }
    get maxDate() {
        let max = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "max") {
                if (max === null || ch.value < max)
                    max = ch.value;
            }
        }
        return max != null ? new Date(max) : null;
    }
}
exports.ZodDate = ZodDate;
ZodDate.create = (params) => {
    return new ZodDate({
        checks: [],
        coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
        typeName: ZodFirstPartyTypeKind.ZodDate,
        ...processCreateParams(params),
    });
};
class ZodSymbol extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== util_1.ZodParsedType.symbol) {
            const ctx = this._getOrReturnCtx(input);
            (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.symbol,
                received: ctx.parsedType,
            });
            return parseUtil_1.INVALID;
        }
        return (0, parseUtil_1.OK)(input.data);
    }
}
exports.ZodSymbol = ZodSymbol;
ZodSymbol.create = (params) => {
    return new ZodSymbol({
        typeName: ZodFirstPartyTypeKind.ZodSymbol,
        ...processCreateParams(params),
    });
};
class ZodUndefined extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== util_1.ZodParsedType.undefined) {
            const ctx = this._getOrReturnCtx(input);
            (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.undefined,
                received: ctx.parsedType,
            });
            return parseUtil_1.INVALID;
        }
        return (0, parseUtil_1.OK)(input.data);
    }
}
exports.ZodUndefined = ZodUndefined;
ZodUndefined.create = (params) => {
    return new ZodUndefined({
        typeName: ZodFirstPartyTypeKind.ZodUndefined,
        ...processCreateParams(params),
    });
};
class ZodNull extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== util_1.ZodParsedType.null) {
            const ctx = this._getOrReturnCtx(input);
            (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.null,
                received: ctx.parsedType,
            });
            return parseUtil_1.INVALID;
        }
        return (0, parseUtil_1.OK)(input.data);
    }
}
exports.ZodNull = ZodNull;
ZodNull.create = (params) => {
    return new ZodNull({
        typeName: ZodFirstPartyTypeKind.ZodNull,
        ...processCreateParams(params),
    });
};
class ZodAny extends ZodType {
    constructor() {
        super(...arguments);
        // to prevent instances of other classes from extending ZodAny. this causes issues with catchall in ZodObject.
        this._any = true;
    }
    _parse(input) {
        return (0, parseUtil_1.OK)(input.data);
    }
}
exports.ZodAny = ZodAny;
ZodAny.create = (params) => {
    return new ZodAny({
        typeName: ZodFirstPartyTypeKind.ZodAny,
        ...processCreateParams(params),
    });
};
class ZodUnknown extends ZodType {
    constructor() {
        super(...arguments);
        // required
        this._unknown = true;
    }
    _parse(input) {
        return (0, parseUtil_1.OK)(input.data);
    }
}
exports.ZodUnknown = ZodUnknown;
ZodUnknown.create = (params) => {
    return new ZodUnknown({
        typeName: ZodFirstPartyTypeKind.ZodUnknown,
        ...processCreateParams(params),
    });
};
class ZodNever extends ZodType {
    _parse(input) {
        const ctx = this._getOrReturnCtx(input);
        (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.never,
            received: ctx.parsedType,
        });
        return parseUtil_1.INVALID;
    }
}
exports.ZodNever = ZodNever;
ZodNever.create = (params) => {
    return new ZodNever({
        typeName: ZodFirstPartyTypeKind.ZodNever,
        ...processCreateParams(params),
    });
};
class ZodVoid extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== util_1.ZodParsedType.undefined) {
            const ctx = this._getOrReturnCtx(input);
            (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.void,
                received: ctx.parsedType,
            });
            return parseUtil_1.INVALID;
        }
        return (0, parseUtil_1.OK)(input.data);
    }
}
exports.ZodVoid = ZodVoid;
ZodVoid.create = (params) => {
    return new ZodVoid({
        typeName: ZodFirstPartyTypeKind.ZodVoid,
        ...processCreateParams(params),
    });
};
class ZodArray extends ZodType {
    _parse(input) {
        const { ctx, status } = this._processInputParams(input);
        const def = this._def;
        if (ctx.parsedType !== util_1.ZodParsedType.array) {
            (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.array,
                received: ctx.parsedType,
            });
            return parseUtil_1.INVALID;
        }
        if (def.exactLength !== null) {
            const tooBig = ctx.data.length > def.exactLength.value;
            const tooSmall = ctx.data.length < def.exactLength.value;
            if (tooBig || tooSmall) {
                (0, parseUtil_1.addIssueToContext)(ctx, {
                    code: tooBig ? ZodError_1.ZodIssueCode.too_big : ZodError_1.ZodIssueCode.too_small,
                    minimum: (tooSmall ? def.exactLength.value : undefined),
                    maximum: (tooBig ? def.exactLength.value : undefined),
                    type: "array",
                    inclusive: true,
                    exact: true,
                    message: def.exactLength.message,
                });
                status.dirty();
            }
        }
        if (def.minLength !== null) {
            if (ctx.data.length < def.minLength.value) {
                (0, parseUtil_1.addIssueToContext)(ctx, {
                    code: ZodError_1.ZodIssueCode.too_small,
                    minimum: def.minLength.value,
                    type: "array",
                    inclusive: true,
                    exact: false,
                    message: def.minLength.message,
                });
                status.dirty();
            }
        }
        if (def.maxLength !== null) {
            if (ctx.data.length > def.maxLength.value) {
                (0, parseUtil_1.addIssueToContext)(ctx, {
                    code: ZodError_1.ZodIssueCode.too_big,
                    maximum: def.maxLength.value,
                    type: "array",
                    inclusive: true,
                    exact: false,
                    message: def.maxLength.message,
                });
                status.dirty();
            }
        }
        if (ctx.common.async) {
            return Promise.all([...ctx.data].map((item, i) => {
                return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
            })).then((result) => {
                return parseUtil_1.ParseStatus.mergeArray(status, result);
            });
        }
        const result = [...ctx.data].map((item, i) => {
            return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
        });
        return parseUtil_1.ParseStatus.mergeArray(status, result);
    }
    get element() {
        return this._def.type;
    }
    min(minLength, message) {
        return new ZodArray({
            ...this._def,
            minLength: { value: minLength, message: errorUtil_1.errorUtil.toString(message) },
        });
    }
    max(maxLength, message) {
        return new ZodArray({
            ...this._def,
            maxLength: { value: maxLength, message: errorUtil_1.errorUtil.toString(message) },
        });
    }
    length(len, message) {
        return new ZodArray({
            ...this._def,
            exactLength: { value: len, message: errorUtil_1.errorUtil.toString(message) },
        });
    }
    nonempty(message) {
        return this.min(1, message);
    }
}
exports.ZodArray = ZodArray;
ZodArray.create = (schema, params) => {
    return new ZodArray({
        type: schema,
        minLength: null,
        maxLength: null,
        exactLength: null,
        typeName: ZodFirstPartyTypeKind.ZodArray,
        ...processCreateParams(params),
    });
};
function deepPartialify(schema) {
    if (schema instanceof ZodObject) {
        const newShape = {};
        for (const key in schema.shape) {
            const fieldSchema = schema.shape[key];
            newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
        }
        return new ZodObject({
            ...schema._def,
            shape: () => newShape,
        });
    }
    else if (schema instanceof ZodArray) {
        return new ZodArray({
            ...schema._def,
            type: deepPartialify(schema.element),
        });
    }
    else if (schema instanceof ZodOptional) {
        return ZodOptional.create(deepPartialify(schema.unwrap()));
    }
    else if (schema instanceof ZodNullable) {
        return ZodNullable.create(deepPartialify(schema.unwrap()));
    }
    else if (schema instanceof ZodTuple) {
        return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
    }
    else {
        return schema;
    }
}
class ZodObject extends ZodType {
    constructor() {
        super(...arguments);
        this._cached = null;
        /**
         * @deprecated In most cases, this is no longer needed - unknown properties are now silently stripped.
         * If you want to pass through unknown properties, use `.passthrough()` instead.
         */
        this.nonstrict = this.passthrough;
        // extend<
        //   Augmentation extends ZodRawShape,
        //   NewOutput extends util.flatten<{
        //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
        //       ? Augmentation[k]["_output"]
        //       : k extends keyof Output
        //       ? Output[k]
        //       : never;
        //   }>,
        //   NewInput extends util.flatten<{
        //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
        //       ? Augmentation[k]["_input"]
        //       : k extends keyof Input
        //       ? Input[k]
        //       : never;
        //   }>
        // >(
        //   augmentation: Augmentation
        // ): ZodObject<
        //   extendShape<T, Augmentation>,
        //   UnknownKeys,
        //   Catchall,
        //   NewOutput,
        //   NewInput
        // > {
        //   return new ZodObject({
        //     ...this._def,
        //     shape: () => ({
        //       ...this._def.shape(),
        //       ...augmentation,
        //     }),
        //   }) as any;
        // }
        /**
         * @deprecated Use `.extend` instead
         *  */
        this.augment = this.extend;
    }
    _getCached() {
        if (this._cached !== null)
            return this._cached;
        const shape = this._def.shape();
        const keys = util_1.util.objectKeys(shape);
        return (this._cached = { shape, keys });
    }
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== util_1.ZodParsedType.object) {
            const ctx = this._getOrReturnCtx(input);
            (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.object,
                received: ctx.parsedType,
            });
            return parseUtil_1.INVALID;
        }
        const { status, ctx } = this._processInputParams(input);
        const { shape, keys: shapeKeys } = this._getCached();
        const extraKeys = [];
        if (!(this._def.catchall instanceof ZodNever &&
            this._def.unknownKeys === "strip")) {
            for (const key in ctx.data) {
                if (!shapeKeys.includes(key)) {
                    extraKeys.push(key);
                }
            }
        }
        const pairs = [];
        for (const key of shapeKeys) {
            const keyValidator = shape[key];
            const value = ctx.data[key];
            pairs.push({
                key: { status: "valid", value: key },
                value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
                alwaysSet: key in ctx.data,
            });
        }
        if (this._def.catchall instanceof ZodNever) {
            const unknownKeys = this._def.unknownKeys;
            if (unknownKeys === "passthrough") {
                for (const key of extraKeys) {
                    pairs.push({
                        key: { status: "valid", value: key },
                        value: { status: "valid", value: ctx.data[key] },
                    });
                }
            }
            else if (unknownKeys === "strict") {
                if (extraKeys.length > 0) {
                    (0, parseUtil_1.addIssueToContext)(ctx, {
                        code: ZodError_1.ZodIssueCode.unrecognized_keys,
                        keys: extraKeys,
                    });
                    status.dirty();
                }
            }
            else if (unknownKeys === "strip") {
            }
            else {
                throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
            }
        }
        else {
            // run catchall validation
            const catchall = this._def.catchall;
            for (const key of extraKeys) {
                const value = ctx.data[key];
                pairs.push({
                    key: { status: "valid", value: key },
                    value: catchall._parse(new ParseInputLazyPath(ctx, value, ctx.path, key) //, ctx.child(key), value, getParsedType(value)
                    ),
                    alwaysSet: key in ctx.data,
                });
            }
        }
        if (ctx.common.async) {
            return Promise.resolve()
                .then(async () => {
                const syncPairs = [];
                for (const pair of pairs) {
                    const key = await pair.key;
                    const value = await pair.value;
                    syncPairs.push({
                        key,
                        value,
                        alwaysSet: pair.alwaysSet,
                    });
                }
                return syncPairs;
            })
                .then((syncPairs) => {
                return parseUtil_1.ParseStatus.mergeObjectSync(status, syncPairs);
            });
        }
        else {
            return parseUtil_1.ParseStatus.mergeObjectSync(status, pairs);
        }
    }
    get shape() {
        return this._def.shape();
    }
    strict(message) {
        errorUtil_1.errorUtil.errToObj;
        return new ZodObject({
            ...this._def,
            unknownKeys: "strict",
            ...(message !== undefined
                ? {
                    errorMap: (issue, ctx) => {
                        var _a, _b, _c, _d;
                        const defaultError = (_c = (_b = (_a = this._def).errorMap) === null || _b === void 0 ? void 0 : _b.call(_a, issue, ctx).message) !== null && _c !== void 0 ? _c : ctx.defaultError;
                        if (issue.code === "unrecognized_keys")
                            return {
                                message: (_d = errorUtil_1.errorUtil.errToObj(message).message) !== null && _d !== void 0 ? _d : defaultError,
                            };
                        return {
                            message: defaultError,
                        };
                    },
                }
                : {}),
        });
    }
    strip() {
        return new ZodObject({
            ...this._def,
            unknownKeys: "strip",
        });
    }
    passthrough() {
        return new ZodObject({
            ...this._def,
            unknownKeys: "passthrough",
        });
    }
    // const AugmentFactory =
    //   <Def extends ZodObjectDef>(def: Def) =>
    //   <Augmentation extends ZodRawShape>(
    //     augmentation: Augmentation
    //   ): ZodObject<
    //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
    //     Def["unknownKeys"],
    //     Def["catchall"]
    //   > => {
    //     return new ZodObject({
    //       ...def,
    //       shape: () => ({
    //         ...def.shape(),
    //         ...augmentation,
    //       }),
    //     }) as any;
    //   };
    extend(augmentation) {
        return new ZodObject({
            ...this._def,
            shape: () => ({
                ...this._def.shape(),
                ...augmentation,
            }),
        });
    }
    /**
     * Prior to zod@1.0.12 there was a bug in the
     * inferred type of merged objects. Please
     * upgrade if you are experiencing issues.
     */
    merge(merging) {
        const merged = new ZodObject({
            unknownKeys: merging._def.unknownKeys,
            catchall: merging._def.catchall,
            shape: () => ({
                ...this._def.shape(),
                ...merging._def.shape(),
            }),
            typeName: ZodFirstPartyTypeKind.ZodObject,
        });
        return merged;
    }
    // merge<
    //   Incoming extends AnyZodObject,
    //   Augmentation extends Incoming["shape"],
    //   NewOutput extends {
    //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
    //       ? Augmentation[k]["_output"]
    //       : k extends keyof Output
    //       ? Output[k]
    //       : never;
    //   },
    //   NewInput extends {
    //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
    //       ? Augmentation[k]["_input"]
    //       : k extends keyof Input
    //       ? Input[k]
    //       : never;
    //   }
    // >(
    //   merging: Incoming
    // ): ZodObject<
    //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
    //   Incoming["_def"]["unknownKeys"],
    //   Incoming["_def"]["catchall"],
    //   NewOutput,
    //   NewInput
    // > {
    //   const merged: any = new ZodObject({
    //     unknownKeys: merging._def.unknownKeys,
    //     catchall: merging._def.catchall,
    //     shape: () =>
    //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
    //     typeName: ZodFirstPartyTypeKind.ZodObject,
    //   }) as any;
    //   return merged;
    // }
    setKey(key, schema) {
        return this.augment({ [key]: schema });
    }
    // merge<Incoming extends AnyZodObject>(
    //   merging: Incoming
    // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
    // ZodObject<
    //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
    //   Incoming["_def"]["unknownKeys"],
    //   Incoming["_def"]["catchall"]
    // > {
    //   // const mergedShape = objectUtil.mergeShapes(
    //   //   this._def.shape(),
    //   //   merging._def.shape()
    //   // );
    //   const merged: any = new ZodObject({
    //     unknownKeys: merging._def.unknownKeys,
    //     catchall: merging._def.catchall,
    //     shape: () =>
    //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
    //     typeName: ZodFirstPartyTypeKind.ZodObject,
    //   }) as any;
    //   return merged;
    // }
    catchall(index) {
        return new ZodObject({
            ...this._def,
            catchall: index,
        });
    }
    pick(mask) {
        const shape = {};
        util_1.util.objectKeys(mask).forEach((key) => {
            if (mask[key] && this.shape[key]) {
                shape[key] = this.shape[key];
            }
        });
        return new ZodObject({
            ...this._def,
            shape: () => shape,
        });
    }
    omit(mask) {
        const shape = {};
        util_1.util.objectKeys(this.shape).forEach((key) => {
            if (!mask[key]) {
                shape[key] = this.shape[key];
            }
        });
        return new ZodObject({
            ...this._def,
            shape: () => shape,
        });
    }
    /**
     * @deprecated
     */
    deepPartial() {
        return deepPartialify(this);
    }
    partial(mask) {
        const newShape = {};
        util_1.util.objectKeys(this.shape).forEach((key) => {
            const fieldSchema = this.shape[key];
            if (mask && !mask[key]) {
                newShape[key] = fieldSchema;
            }
            else {
                newShape[key] = fieldSchema.optional();
            }
        });
        return new ZodObject({
            ...this._def,
            shape: () => newShape,
        });
    }
    required(mask) {
        const newShape = {};
        util_1.util.objectKeys(this.shape).forEach((key) => {
            if (mask && !mask[key]) {
                newShape[key] = this.shape[key];
            }
            else {
                const fieldSchema = this.shape[key];
                let newField = fieldSchema;
                while (newField instanceof ZodOptional) {
                    newField = newField._def.innerType;
                }
                newShape[key] = newField;
            }
        });
        return new ZodObject({
            ...this._def,
            shape: () => newShape,
        });
    }
    keyof() {
        return createZodEnum(util_1.util.objectKeys(this.shape));
    }
}
exports.ZodObject = ZodObject;
ZodObject.create = (shape, params) => {
    return new ZodObject({
        shape: () => shape,
        unknownKeys: "strip",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params),
    });
};
ZodObject.strictCreate = (shape, params) => {
    return new ZodObject({
        shape: () => shape,
        unknownKeys: "strict",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params),
    });
};
ZodObject.lazycreate = (shape, params) => {
    return new ZodObject({
        shape,
        unknownKeys: "strip",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params),
    });
};
class ZodUnion extends ZodType {
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        const options = this._def.options;
        function handleResults(results) {
            // return first issue-free validation if it exists
            for (const result of results) {
                if (result.result.status === "valid") {
                    return result.result;
                }
            }
            for (const result of results) {
                if (result.result.status === "dirty") {
                    // add issues from dirty option
                    ctx.common.issues.push(...result.ctx.common.issues);
                    return result.result;
                }
            }
            // return invalid
            const unionErrors = results.map((result) => new ZodError_1.ZodError(result.ctx.common.issues));
            (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_union,
                unionErrors,
            });
            return parseUtil_1.INVALID;
        }
        if (ctx.common.async) {
            return Promise.all(options.map(async (option) => {
                const childCtx = {
                    ...ctx,
                    common: {
                        ...ctx.common,
                        issues: [],
                    },
                    parent: null,
                };
                return {
                    result: await option._parseAsync({
                        data: ctx.data,
                        path: ctx.path,
                        parent: childCtx,
                    }),
                    ctx: childCtx,
                };
            })).then(handleResults);
        }
        else {
            let dirty = undefined;
            const issues = [];
            for (const option of options) {
                const childCtx = {
                    ...ctx,
                    common: {
                        ...ctx.common,
                        issues: [],
                    },
                    parent: null,
                };
                const result = option._parseSync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: childCtx,
                });
                if (result.status === "valid") {
                    return result;
                }
                else if (result.status === "dirty" && !dirty) {
                    dirty = { result, ctx: childCtx };
                }
                if (childCtx.common.issues.length) {
                    issues.push(childCtx.common.issues);
                }
            }
            if (dirty) {
                ctx.common.issues.push(...dirty.ctx.common.issues);
                return dirty.result;
            }
            const unionErrors = issues.map((issues) => new ZodError_1.ZodError(issues));
            (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_union,
                unionErrors,
            });
            return parseUtil_1.INVALID;
        }
    }
    get options() {
        return this._def.options;
    }
}
exports.ZodUnion = ZodUnion;
ZodUnion.create = (types, params) => {
    return new ZodUnion({
        options: types,
        typeName: ZodFirstPartyTypeKind.ZodUnion,
        ...processCreateParams(params),
    });
};
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
//////////                                 //////////
//////////      ZodDiscriminatedUnion      //////////
//////////                                 //////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
const getDiscriminator = (type) => {
    if (type instanceof ZodLazy) {
        return getDiscriminator(type.schema);
    }
    else if (type instanceof ZodEffects) {
        return getDiscriminator(type.innerType());
    }
    else if (type instanceof ZodLiteral) {
        return [type.value];
    }
    else if (type instanceof ZodEnum) {
        return type.options;
    }
    else if (type instanceof ZodNativeEnum) {
        // eslint-disable-next-line ban/ban
        return util_1.util.objectValues(type.enum);
    }
    else if (type instanceof ZodDefault) {
        return getDiscriminator(type._def.innerType);
    }
    else if (type instanceof ZodUndefined) {
        return [undefined];
    }
    else if (type instanceof ZodNull) {
        return [null];
    }
    else if (type instanceof ZodOptional) {
        return [undefined, ...getDiscriminator(type.unwrap())];
    }
    else if (type instanceof ZodNullable) {
        return [null, ...getDiscriminator(type.unwrap())];
    }
    else if (type instanceof ZodBranded) {
        return getDiscriminator(type.unwrap());
    }
    else if (type instanceof ZodReadonly) {
        return getDiscriminator(type.unwrap());
    }
    else if (type instanceof ZodCatch) {
        return getDiscriminator(type._def.innerType);
    }
    else {
        return [];
    }
};
class ZodDiscriminatedUnion extends ZodType {
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== util_1.ZodParsedType.object) {
            (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.object,
                received: ctx.parsedType,
            });
            return parseUtil_1.INVALID;
        }
        const discriminator = this.discriminator;
        const discriminatorValue = ctx.data[discriminator];
        const option = this.optionsMap.get(discriminatorValue);
        if (!option) {
            (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_union_discriminator,
                options: Array.from(this.optionsMap.keys()),
                path: [discriminator],
            });
            return parseUtil_1.INVALID;
        }
        if (ctx.common.async) {
            return option._parseAsync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx,
            });
        }
        else {
            return option._parseSync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx,
            });
        }
    }
    get discriminator() {
        return this._def.discriminator;
    }
    get options() {
        return this._def.options;
    }
    get optionsMap() {
        return this._def.optionsMap;
    }
    /**
     * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
     * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
     * have a different value for each object in the union.
     * @param discriminator the name of the discriminator property
     * @param types an array of object schemas
     * @param params
     */
    static create(discriminator, options, params) {
        // Get all the valid discriminator values
        const optionsMap = new Map();
        // try {
        for (const type of options) {
            const discriminatorValues = getDiscriminator(type.shape[discriminator]);
            if (!discriminatorValues.length) {
                throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
            }
            for (const value of discriminatorValues) {
                if (optionsMap.has(value)) {
                    throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
                }
                optionsMap.set(value, type);
            }
        }
        return new ZodDiscriminatedUnion({
            typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
            discriminator,
            options,
            optionsMap,
            ...processCreateParams(params),
        });
    }
}
exports.ZodDiscriminatedUnion = ZodDiscriminatedUnion;
function mergeValues(a, b) {
    const aType = (0, util_1.getParsedType)(a);
    const bType = (0, util_1.getParsedType)(b);
    if (a === b) {
        return { valid: true, data: a };
    }
    else if (aType === util_1.ZodParsedType.object && bType === util_1.ZodParsedType.object) {
        const bKeys = util_1.util.objectKeys(b);
        const sharedKeys = util_1.util
            .objectKeys(a)
            .filter((key) => bKeys.indexOf(key) !== -1);
        const newObj = { ...a, ...b };
        for (const key of sharedKeys) {
            const sharedValue = mergeValues(a[key], b[key]);
            if (!sharedValue.valid) {
                return { valid: false };
            }
            newObj[key] = sharedValue.data;
        }
        return { valid: true, data: newObj };
    }
    else if (aType === util_1.ZodParsedType.array && bType === util_1.ZodParsedType.array) {
        if (a.length !== b.length) {
            return { valid: false };
        }
        const newArray = [];
        for (let index = 0; index < a.length; index++) {
            const itemA = a[index];
            const itemB = b[index];
            const sharedValue = mergeValues(itemA, itemB);
            if (!sharedValue.valid) {
                return { valid: false };
            }
            newArray.push(sharedValue.data);
        }
        return { valid: true, data: newArray };
    }
    else if (aType === util_1.ZodParsedType.date &&
        bType === util_1.ZodParsedType.date &&
        +a === +b) {
        return { valid: true, data: a };
    }
    else {
        return { valid: false };
    }
}
class ZodIntersection extends ZodType {
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        const handleParsed = (parsedLeft, parsedRight) => {
            if ((0, parseUtil_1.isAborted)(parsedLeft) || (0, parseUtil_1.isAborted)(parsedRight)) {
                return parseUtil_1.INVALID;
            }
            const merged = mergeValues(parsedLeft.value, parsedRight.value);
            if (!merged.valid) {
                (0, parseUtil_1.addIssueToContext)(ctx, {
                    code: ZodError_1.ZodIssueCode.invalid_intersection_types,
                });
                return parseUtil_1.INVALID;
            }
            if ((0, parseUtil_1.isDirty)(parsedLeft) || (0, parseUtil_1.isDirty)(parsedRight)) {
                status.dirty();
            }
            return { status: status.value, value: merged.data };
        };
        if (ctx.common.async) {
            return Promise.all([
                this._def.left._parseAsync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                }),
                this._def.right._parseAsync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                }),
            ]).then(([left, right]) => handleParsed(left, right));
        }
        else {
            return handleParsed(this._def.left._parseSync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx,
            }), this._def.right._parseSync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx,
            }));
        }
    }
}
exports.ZodIntersection = ZodIntersection;
ZodIntersection.create = (left, right, params) => {
    return new ZodIntersection({
        left: left,
        right: right,
        typeName: ZodFirstPartyTypeKind.ZodIntersection,
        ...processCreateParams(params),
    });
};
class ZodTuple extends ZodType {
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== util_1.ZodParsedType.array) {
            (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.array,
                received: ctx.parsedType,
            });
            return parseUtil_1.INVALID;
        }
        if (ctx.data.length < this._def.items.length) {
            (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.too_small,
                minimum: this._def.items.length,
                inclusive: true,
                exact: false,
                type: "array",
            });
            return parseUtil_1.INVALID;
        }
        const rest = this._def.rest;
        if (!rest && ctx.data.length > this._def.items.length) {
            (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.too_big,
                maximum: this._def.items.length,
                inclusive: true,
                exact: false,
                type: "array",
            });
            status.dirty();
        }
        const items = [...ctx.data]
            .map((item, itemIndex) => {
            const schema = this._def.items[itemIndex] || this._def.rest;
            if (!schema)
                return null;
            return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
        })
            .filter((x) => !!x); // filter nulls
        if (ctx.common.async) {
            return Promise.all(items).then((results) => {
                return parseUtil_1.ParseStatus.mergeArray(status, results);
            });
        }
        else {
            return parseUtil_1.ParseStatus.mergeArray(status, items);
        }
    }
    get items() {
        return this._def.items;
    }
    rest(rest) {
        return new ZodTuple({
            ...this._def,
            rest,
        });
    }
}
exports.ZodTuple = ZodTuple;
ZodTuple.create = (schemas, params) => {
    if (!Array.isArray(schemas)) {
        throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
    }
    return new ZodTuple({
        items: schemas,
        typeName: ZodFirstPartyTypeKind.ZodTuple,
        rest: null,
        ...processCreateParams(params),
    });
};
class ZodRecord extends ZodType {
    get keySchema() {
        return this._def.keyType;
    }
    get valueSchema() {
        return this._def.valueType;
    }
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== util_1.ZodParsedType.object) {
            (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.object,
                received: ctx.parsedType,
            });
            return parseUtil_1.INVALID;
        }
        const pairs = [];
        const keyType = this._def.keyType;
        const valueType = this._def.valueType;
        for (const key in ctx.data) {
            pairs.push({
                key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
                value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
                alwaysSet: key in ctx.data,
            });
        }
        if (ctx.common.async) {
            return parseUtil_1.ParseStatus.mergeObjectAsync(status, pairs);
        }
        else {
            return parseUtil_1.ParseStatus.mergeObjectSync(status, pairs);
        }
    }
    get element() {
        return this._def.valueType;
    }
    static create(first, second, third) {
        if (second instanceof ZodType) {
            return new ZodRecord({
                keyType: first,
                valueType: second,
                typeName: ZodFirstPartyTypeKind.ZodRecord,
                ...processCreateParams(third),
            });
        }
        return new ZodRecord({
            keyType: ZodString.create(),
            valueType: first,
            typeName: ZodFirstPartyTypeKind.ZodRecord,
            ...processCreateParams(second),
        });
    }
}
exports.ZodRecord = ZodRecord;
class ZodMap extends ZodType {
    get keySchema() {
        return this._def.keyType;
    }
    get valueSchema() {
        return this._def.valueType;
    }
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== util_1.ZodParsedType.map) {
            (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.map,
                received: ctx.parsedType,
            });
            return parseUtil_1.INVALID;
        }
        const keyType = this._def.keyType;
        const valueType = this._def.valueType;
        const pairs = [...ctx.data.entries()].map(([key, value], index) => {
            return {
                key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
                value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"])),
            };
        });
        if (ctx.common.async) {
            const finalMap = new Map();
            return Promise.resolve().then(async () => {
                for (const pair of pairs) {
                    const key = await pair.key;
                    const value = await pair.value;
                    if (key.status === "aborted" || value.status === "aborted") {
                        return parseUtil_1.INVALID;
                    }
                    if (key.status === "dirty" || value.status === "dirty") {
                        status.dirty();
                    }
                    finalMap.set(key.value, value.value);
                }
                return { status: status.value, value: finalMap };
            });
        }
        else {
            const finalMap = new Map();
            for (const pair of pairs) {
                const key = pair.key;
                const value = pair.value;
                if (key.status === "aborted" || value.status === "aborted") {
                    return parseUtil_1.INVALID;
                }
                if (key.status === "dirty" || value.status === "dirty") {
                    status.dirty();
                }
                finalMap.set(key.value, value.value);
            }
            return { status: status.value, value: finalMap };
        }
    }
}
exports.ZodMap = ZodMap;
ZodMap.create = (keyType, valueType, params) => {
    return new ZodMap({
        valueType,
        keyType,
        typeName: ZodFirstPartyTypeKind.ZodMap,
        ...processCreateParams(params),
    });
};
class ZodSet extends ZodType {
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== util_1.ZodParsedType.set) {
            (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.set,
                received: ctx.parsedType,
            });
            return parseUtil_1.INVALID;
        }
        const def = this._def;
        if (def.minSize !== null) {
            if (ctx.data.size < def.minSize.value) {
                (0, parseUtil_1.addIssueToContext)(ctx, {
                    code: ZodError_1.ZodIssueCode.too_small,
                    minimum: def.minSize.value,
                    type: "set",
                    inclusive: true,
                    exact: false,
                    message: def.minSize.message,
                });
                status.dirty();
            }
        }
        if (def.maxSize !== null) {
            if (ctx.data.size > def.maxSize.value) {
                (0, parseUtil_1.addIssueToContext)(ctx, {
                    code: ZodError_1.ZodIssueCode.too_big,
                    maximum: def.maxSize.value,
                    type: "set",
                    inclusive: true,
                    exact: false,
                    message: def.maxSize.message,
                });
                status.dirty();
            }
        }
        const valueType = this._def.valueType;
        function finalizeSet(elements) {
            const parsedSet = new Set();
            for (const element of elements) {
                if (element.status === "aborted")
                    return parseUtil_1.INVALID;
                if (element.status === "dirty")
                    status.dirty();
                parsedSet.add(element.value);
            }
            return { status: status.value, value: parsedSet };
        }
        const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
        if (ctx.common.async) {
            return Promise.all(elements).then((elements) => finalizeSet(elements));
        }
        else {
            return finalizeSet(elements);
        }
    }
    min(minSize, message) {
        return new ZodSet({
            ...this._def,
            minSize: { value: minSize, message: errorUtil_1.errorUtil.toString(message) },
        });
    }
    max(maxSize, message) {
        return new ZodSet({
            ...this._def,
            maxSize: { value: maxSize, message: errorUtil_1.errorUtil.toString(message) },
        });
    }
    size(size, message) {
        return this.min(size, message).max(size, message);
    }
    nonempty(message) {
        return this.min(1, message);
    }
}
exports.ZodSet = ZodSet;
ZodSet.create = (valueType, params) => {
    return new ZodSet({
        valueType,
        minSize: null,
        maxSize: null,
        typeName: ZodFirstPartyTypeKind.ZodSet,
        ...processCreateParams(params),
    });
};
class ZodFunction extends ZodType {
    constructor() {
        super(...arguments);
        this.validate = this.implement;
    }
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== util_1.ZodParsedType.function) {
            (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.function,
                received: ctx.parsedType,
            });
            return parseUtil_1.INVALID;
        }
        function makeArgsIssue(args, error) {
            return (0, parseUtil_1.makeIssue)({
                data: args,
                path: ctx.path,
                errorMaps: [
                    ctx.common.contextualErrorMap,
                    ctx.schemaErrorMap,
                    (0, errors_1.getErrorMap)(),
                    errors_1.defaultErrorMap,
                ].filter((x) => !!x),
                issueData: {
                    code: ZodError_1.ZodIssueCode.invalid_arguments,
                    argumentsError: error,
                },
            });
        }
        function makeReturnsIssue(returns, error) {
            return (0, parseUtil_1.makeIssue)({
                data: returns,
                path: ctx.path,
                errorMaps: [
                    ctx.common.contextualErrorMap,
                    ctx.schemaErrorMap,
                    (0, errors_1.getErrorMap)(),
                    errors_1.defaultErrorMap,
                ].filter((x) => !!x),
                issueData: {
                    code: ZodError_1.ZodIssueCode.invalid_return_type,
                    returnTypeError: error,
                },
            });
        }
        const params = { errorMap: ctx.common.contextualErrorMap };
        const fn = ctx.data;
        if (this._def.returns instanceof ZodPromise) {
            // Would love a way to avoid disabling this rule, but we need
            // an alias (using an arrow function was what caused 2651).
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const me = this;
            return (0, parseUtil_1.OK)(async function (...args) {
                const error = new ZodError_1.ZodError([]);
                const parsedArgs = await me._def.args
                    .parseAsync(args, params)
                    .catch((e) => {
                    error.addIssue(makeArgsIssue(args, e));
                    throw error;
                });
                const result = await Reflect.apply(fn, this, parsedArgs);
                const parsedReturns = await me._def.returns._def.type
                    .parseAsync(result, params)
                    .catch((e) => {
                    error.addIssue(makeReturnsIssue(result, e));
                    throw error;
                });
                return parsedReturns;
            });
        }
        else {
            // Would love a way to avoid disabling this rule, but we need
            // an alias (using an arrow function was what caused 2651).
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const me = this;
            return (0, parseUtil_1.OK)(function (...args) {
                const parsedArgs = me._def.args.safeParse(args, params);
                if (!parsedArgs.success) {
                    throw new ZodError_1.ZodError([makeArgsIssue(args, parsedArgs.error)]);
                }
                const result = Reflect.apply(fn, this, parsedArgs.data);
                const parsedReturns = me._def.returns.safeParse(result, params);
                if (!parsedReturns.success) {
                    throw new ZodError_1.ZodError([makeReturnsIssue(result, parsedReturns.error)]);
                }
                return parsedReturns.data;
            });
        }
    }
    parameters() {
        return this._def.args;
    }
    returnType() {
        return this._def.returns;
    }
    args(...items) {
        return new ZodFunction({
            ...this._def,
            args: ZodTuple.create(items).rest(ZodUnknown.create()),
        });
    }
    returns(returnType) {
        return new ZodFunction({
            ...this._def,
            returns: returnType,
        });
    }
    implement(func) {
        const validatedFunc = this.parse(func);
        return validatedFunc;
    }
    strictImplement(func) {
        const validatedFunc = this.parse(func);
        return validatedFunc;
    }
    static create(args, returns, params) {
        return new ZodFunction({
            args: (args
                ? args
                : ZodTuple.create([]).rest(ZodUnknown.create())),
            returns: returns || ZodUnknown.create(),
            typeName: ZodFirstPartyTypeKind.ZodFunction,
            ...processCreateParams(params),
        });
    }
}
exports.ZodFunction = ZodFunction;
class ZodLazy extends ZodType {
    get schema() {
        return this._def.getter();
    }
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        const lazySchema = this._def.getter();
        return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
    }
}
exports.ZodLazy = ZodLazy;
ZodLazy.create = (getter, params) => {
    return new ZodLazy({
        getter: getter,
        typeName: ZodFirstPartyTypeKind.ZodLazy,
        ...processCreateParams(params),
    });
};
class ZodLiteral extends ZodType {
    _parse(input) {
        if (input.data !== this._def.value) {
            const ctx = this._getOrReturnCtx(input);
            (0, parseUtil_1.addIssueToContext)(ctx, {
                received: ctx.data,
                code: ZodError_1.ZodIssueCode.invalid_literal,
                expected: this._def.value,
            });
            return parseUtil_1.INVALID;
        }
        return { status: "valid", value: input.data };
    }
    get value() {
        return this._def.value;
    }
}
exports.ZodLiteral = ZodLiteral;
ZodLiteral.create = (value, params) => {
    return new ZodLiteral({
        value: value,
        typeName: ZodFirstPartyTypeKind.ZodLiteral,
        ...processCreateParams(params),
    });
};
function createZodEnum(values, params) {
    return new ZodEnum({
        values,
        typeName: ZodFirstPartyTypeKind.ZodEnum,
        ...processCreateParams(params),
    });
}
class ZodEnum extends ZodType {
    constructor() {
        super(...arguments);
        _ZodEnum_cache.set(this, void 0);
    }
    _parse(input) {
        if (typeof input.data !== "string") {
            const ctx = this._getOrReturnCtx(input);
            const expectedValues = this._def.values;
            (0, parseUtil_1.addIssueToContext)(ctx, {
                expected: util_1.util.joinValues(expectedValues),
                received: ctx.parsedType,
                code: ZodError_1.ZodIssueCode.invalid_type,
            });
            return parseUtil_1.INVALID;
        }
        if (!__classPrivateFieldGet(this, _ZodEnum_cache, "f")) {
            __classPrivateFieldSet(this, _ZodEnum_cache, new Set(this._def.values), "f");
        }
        if (!__classPrivateFieldGet(this, _ZodEnum_cache, "f").has(input.data)) {
            const ctx = this._getOrReturnCtx(input);
            const expectedValues = this._def.values;
            (0, parseUtil_1.addIssueToContext)(ctx, {
                received: ctx.data,
                code: ZodError_1.ZodIssueCode.invalid_enum_value,
                options: expectedValues,
            });
            return parseUtil_1.INVALID;
        }
        return (0, parseUtil_1.OK)(input.data);
    }
    get options() {
        return this._def.values;
    }
    get enum() {
        const enumValues = {};
        for (const val of this._def.values) {
            enumValues[val] = val;
        }
        return enumValues;
    }
    get Values() {
        const enumValues = {};
        for (const val of this._def.values) {
            enumValues[val] = val;
        }
        return enumValues;
    }
    get Enum() {
        const enumValues = {};
        for (const val of this._def.values) {
            enumValues[val] = val;
        }
        return enumValues;
    }
    extract(values, newDef = this._def) {
        return ZodEnum.create(values, {
            ...this._def,
            ...newDef,
        });
    }
    exclude(values, newDef = this._def) {
        return ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
            ...this._def,
            ...newDef,
        });
    }
}
exports.ZodEnum = ZodEnum;
_ZodEnum_cache = new WeakMap();
ZodEnum.create = createZodEnum;
class ZodNativeEnum extends ZodType {
    constructor() {
        super(...arguments);
        _ZodNativeEnum_cache.set(this, void 0);
    }
    _parse(input) {
        const nativeEnumValues = util_1.util.getValidEnumValues(this._def.values);
        const ctx = this._getOrReturnCtx(input);
        if (ctx.parsedType !== util_1.ZodParsedType.string &&
            ctx.parsedType !== util_1.ZodParsedType.number) {
            const expectedValues = util_1.util.objectValues(nativeEnumValues);
            (0, parseUtil_1.addIssueToContext)(ctx, {
                expected: util_1.util.joinValues(expectedValues),
                received: ctx.parsedType,
                code: ZodError_1.ZodIssueCode.invalid_type,
            });
            return parseUtil_1.INVALID;
        }
        if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache, "f")) {
            __classPrivateFieldSet(this, _ZodNativeEnum_cache, new Set(util_1.util.getValidEnumValues(this._def.values)), "f");
        }
        if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache, "f").has(input.data)) {
            const expectedValues = util_1.util.objectValues(nativeEnumValues);
            (0, parseUtil_1.addIssueToContext)(ctx, {
                received: ctx.data,
                code: ZodError_1.ZodIssueCode.invalid_enum_value,
                options: expectedValues,
            });
            return parseUtil_1.INVALID;
        }
        return (0, parseUtil_1.OK)(input.data);
    }
    get enum() {
        return this._def.values;
    }
}
exports.ZodNativeEnum = ZodNativeEnum;
_ZodNativeEnum_cache = new WeakMap();
ZodNativeEnum.create = (values, params) => {
    return new ZodNativeEnum({
        values: values,
        typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
        ...processCreateParams(params),
    });
};
class ZodPromise extends ZodType {
    unwrap() {
        return this._def.type;
    }
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== util_1.ZodParsedType.promise &&
            ctx.common.async === false) {
            (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.promise,
                received: ctx.parsedType,
            });
            return parseUtil_1.INVALID;
        }
        const promisified = ctx.parsedType === util_1.ZodParsedType.promise
            ? ctx.data
            : Promise.resolve(ctx.data);
        return (0, parseUtil_1.OK)(promisified.then((data) => {
            return this._def.type.parseAsync(data, {
                path: ctx.path,
                errorMap: ctx.common.contextualErrorMap,
            });
        }));
    }
}
exports.ZodPromise = ZodPromise;
ZodPromise.create = (schema, params) => {
    return new ZodPromise({
        type: schema,
        typeName: ZodFirstPartyTypeKind.ZodPromise,
        ...processCreateParams(params),
    });
};
class ZodEffects extends ZodType {
    innerType() {
        return this._def.schema;
    }
    sourceType() {
        return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects
            ? this._def.schema.sourceType()
            : this._def.schema;
    }
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        const effect = this._def.effect || null;
        const checkCtx = {
            addIssue: (arg) => {
                (0, parseUtil_1.addIssueToContext)(ctx, arg);
                if (arg.fatal) {
                    status.abort();
                }
                else {
                    status.dirty();
                }
            },
            get path() {
                return ctx.path;
            },
        };
        checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
        if (effect.type === "preprocess") {
            const processed = effect.transform(ctx.data, checkCtx);
            if (ctx.common.async) {
                return Promise.resolve(processed).then(async (processed) => {
                    if (status.value === "aborted")
                        return parseUtil_1.INVALID;
                    const result = await this._def.schema._parseAsync({
                        data: processed,
                        path: ctx.path,
                        parent: ctx,
                    });
                    if (result.status === "aborted")
                        return parseUtil_1.INVALID;
                    if (result.status === "dirty")
                        return (0, parseUtil_1.DIRTY)(result.value);
                    if (status.value === "dirty")
                        return (0, parseUtil_1.DIRTY)(result.value);
                    return result;
                });
            }
            else {
                if (status.value === "aborted")
                    return parseUtil_1.INVALID;
                const result = this._def.schema._parseSync({
                    data: processed,
                    path: ctx.path,
                    parent: ctx,
                });
                if (result.status === "aborted")
                    return parseUtil_1.INVALID;
                if (result.status === "dirty")
                    return (0, parseUtil_1.DIRTY)(result.value);
                if (status.value === "dirty")
                    return (0, parseUtil_1.DIRTY)(result.value);
                return result;
            }
        }
        if (effect.type === "refinement") {
            const executeRefinement = (acc) => {
                const result = effect.refinement(acc, checkCtx);
                if (ctx.common.async) {
                    return Promise.resolve(result);
                }
                if (result instanceof Promise) {
                    throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
                }
                return acc;
            };
            if (ctx.common.async === false) {
                const inner = this._def.schema._parseSync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                });
                if (inner.status === "aborted")
                    return parseUtil_1.INVALID;
                if (inner.status === "dirty")
                    status.dirty();
                // return value is ignored
                executeRefinement(inner.value);
                return { status: status.value, value: inner.value };
            }
            else {
                return this._def.schema
                    ._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx })
                    .then((inner) => {
                    if (inner.status === "aborted")
                        return parseUtil_1.INVALID;
                    if (inner.status === "dirty")
                        status.dirty();
                    return executeRefinement(inner.value).then(() => {
                        return { status: status.value, value: inner.value };
                    });
                });
            }
        }
        if (effect.type === "transform") {
            if (ctx.common.async === false) {
                const base = this._def.schema._parseSync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                });
                if (!(0, parseUtil_1.isValid)(base))
                    return base;
                const result = effect.transform(base.value, checkCtx);
                if (result instanceof Promise) {
                    throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
                }
                return { status: status.value, value: result };
            }
            else {
                return this._def.schema
                    ._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx })
                    .then((base) => {
                    if (!(0, parseUtil_1.isValid)(base))
                        return base;
                    return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({ status: status.value, value: result }));
                });
            }
        }
        util_1.util.assertNever(effect);
    }
}
exports.ZodEffects = ZodEffects;
exports.ZodTransformer = ZodEffects;
ZodEffects.create = (schema, effect, params) => {
    return new ZodEffects({
        schema,
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        effect,
        ...processCreateParams(params),
    });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
    return new ZodEffects({
        schema,
        effect: { type: "preprocess", transform: preprocess },
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        ...processCreateParams(params),
    });
};
class ZodOptional extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType === util_1.ZodParsedType.undefined) {
            return (0, parseUtil_1.OK)(undefined);
        }
        return this._def.innerType._parse(input);
    }
    unwrap() {
        return this._def.innerType;
    }
}
exports.ZodOptional = ZodOptional;
ZodOptional.create = (type, params) => {
    return new ZodOptional({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodOptional,
        ...processCreateParams(params),
    });
};
class ZodNullable extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType === util_1.ZodParsedType.null) {
            return (0, parseUtil_1.OK)(null);
        }
        return this._def.innerType._parse(input);
    }
    unwrap() {
        return this._def.innerType;
    }
}
exports.ZodNullable = ZodNullable;
ZodNullable.create = (type, params) => {
    return new ZodNullable({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodNullable,
        ...processCreateParams(params),
    });
};
class ZodDefault extends ZodType {
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        let data = ctx.data;
        if (ctx.parsedType === util_1.ZodParsedType.undefined) {
            data = this._def.defaultValue();
        }
        return this._def.innerType._parse({
            data,
            path: ctx.path,
            parent: ctx,
        });
    }
    removeDefault() {
        return this._def.innerType;
    }
}
exports.ZodDefault = ZodDefault;
ZodDefault.create = (type, params) => {
    return new ZodDefault({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodDefault,
        defaultValue: typeof params.default === "function"
            ? params.default
            : () => params.default,
        ...processCreateParams(params),
    });
};
class ZodCatch extends ZodType {
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        // newCtx is used to not collect issues from inner types in ctx
        const newCtx = {
            ...ctx,
            common: {
                ...ctx.common,
                issues: [],
            },
        };
        const result = this._def.innerType._parse({
            data: newCtx.data,
            path: newCtx.path,
            parent: {
                ...newCtx,
            },
        });
        if ((0, parseUtil_1.isAsync)(result)) {
            return result.then((result) => {
                return {
                    status: "valid",
                    value: result.status === "valid"
                        ? result.value
                        : this._def.catchValue({
                            get error() {
                                return new ZodError_1.ZodError(newCtx.common.issues);
                            },
                            input: newCtx.data,
                        }),
                };
            });
        }
        else {
            return {
                status: "valid",
                value: result.status === "valid"
                    ? result.value
                    : this._def.catchValue({
                        get error() {
                            return new ZodError_1.ZodError(newCtx.common.issues);
                        },
                        input: newCtx.data,
                    }),
            };
        }
    }
    removeCatch() {
        return this._def.innerType;
    }
}
exports.ZodCatch = ZodCatch;
ZodCatch.create = (type, params) => {
    return new ZodCatch({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodCatch,
        catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
        ...processCreateParams(params),
    });
};
class ZodNaN extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== util_1.ZodParsedType.nan) {
            const ctx = this._getOrReturnCtx(input);
            (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: util_1.ZodParsedType.nan,
                received: ctx.parsedType,
            });
            return parseUtil_1.INVALID;
        }
        return { status: "valid", value: input.data };
    }
}
exports.ZodNaN = ZodNaN;
ZodNaN.create = (params) => {
    return new ZodNaN({
        typeName: ZodFirstPartyTypeKind.ZodNaN,
        ...processCreateParams(params),
    });
};
exports.BRAND = Symbol("zod_brand");
class ZodBranded extends ZodType {
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        const data = ctx.data;
        return this._def.type._parse({
            data,
            path: ctx.path,
            parent: ctx,
        });
    }
    unwrap() {
        return this._def.type;
    }
}
exports.ZodBranded = ZodBranded;
class ZodPipeline extends ZodType {
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.common.async) {
            const handleAsync = async () => {
                const inResult = await this._def.in._parseAsync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                });
                if (inResult.status === "aborted")
                    return parseUtil_1.INVALID;
                if (inResult.status === "dirty") {
                    status.dirty();
                    return (0, parseUtil_1.DIRTY)(inResult.value);
                }
                else {
                    return this._def.out._parseAsync({
                        data: inResult.value,
                        path: ctx.path,
                        parent: ctx,
                    });
                }
            };
            return handleAsync();
        }
        else {
            const inResult = this._def.in._parseSync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx,
            });
            if (inResult.status === "aborted")
                return parseUtil_1.INVALID;
            if (inResult.status === "dirty") {
                status.dirty();
                return {
                    status: "dirty",
                    value: inResult.value,
                };
            }
            else {
                return this._def.out._parseSync({
                    data: inResult.value,
                    path: ctx.path,
                    parent: ctx,
                });
            }
        }
    }
    static create(a, b) {
        return new ZodPipeline({
            in: a,
            out: b,
            typeName: ZodFirstPartyTypeKind.ZodPipeline,
        });
    }
}
exports.ZodPipeline = ZodPipeline;
class ZodReadonly extends ZodType {
    _parse(input) {
        const result = this._def.innerType._parse(input);
        const freeze = (data) => {
            if ((0, parseUtil_1.isValid)(data)) {
                data.value = Object.freeze(data.value);
            }
            return data;
        };
        return (0, parseUtil_1.isAsync)(result)
            ? result.then((data) => freeze(data))
            : freeze(result);
    }
    unwrap() {
        return this._def.innerType;
    }
}
exports.ZodReadonly = ZodReadonly;
ZodReadonly.create = (type, params) => {
    return new ZodReadonly({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodReadonly,
        ...processCreateParams(params),
    });
};
////////////////////////////////////////
////////////////////////////////////////
//////////                    //////////
//////////      z.custom      //////////
//////////                    //////////
////////////////////////////////////////
////////////////////////////////////////
function cleanParams(params, data) {
    const p = typeof params === "function"
        ? params(data)
        : typeof params === "string"
            ? { message: params }
            : params;
    const p2 = typeof p === "string" ? { message: p } : p;
    return p2;
}
function custom(check, _params = {}, 
/**
 * @deprecated
 *
 * Pass `fatal` into the params object instead:
 *
 * ```ts
 * z.string().custom((val) => val.length > 5, { fatal: false })
 * ```
 *
 */
fatal) {
    if (check)
        return ZodAny.create().superRefine((data, ctx) => {
            var _a, _b;
            const r = check(data);
            if (r instanceof Promise) {
                return r.then((r) => {
                    var _a, _b;
                    if (!r) {
                        const params = cleanParams(_params, data);
                        const _fatal = (_b = (_a = params.fatal) !== null && _a !== void 0 ? _a : fatal) !== null && _b !== void 0 ? _b : true;
                        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
                    }
                });
            }
            if (!r) {
                const params = cleanParams(_params, data);
                const _fatal = (_b = (_a = params.fatal) !== null && _a !== void 0 ? _a : fatal) !== null && _b !== void 0 ? _b : true;
                ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
            }
            return;
        });
    return ZodAny.create();
}
exports.custom = custom;
exports.late = {
    object: ZodObject.lazycreate,
};
var ZodFirstPartyTypeKind;
(function (ZodFirstPartyTypeKind) {
    ZodFirstPartyTypeKind["ZodString"] = "ZodString";
    ZodFirstPartyTypeKind["ZodNumber"] = "ZodNumber";
    ZodFirstPartyTypeKind["ZodNaN"] = "ZodNaN";
    ZodFirstPartyTypeKind["ZodBigInt"] = "ZodBigInt";
    ZodFirstPartyTypeKind["ZodBoolean"] = "ZodBoolean";
    ZodFirstPartyTypeKind["ZodDate"] = "ZodDate";
    ZodFirstPartyTypeKind["ZodSymbol"] = "ZodSymbol";
    ZodFirstPartyTypeKind["ZodUndefined"] = "ZodUndefined";
    ZodFirstPartyTypeKind["ZodNull"] = "ZodNull";
    ZodFirstPartyTypeKind["ZodAny"] = "ZodAny";
    ZodFirstPartyTypeKind["ZodUnknown"] = "ZodUnknown";
    ZodFirstPartyTypeKind["ZodNever"] = "ZodNever";
    ZodFirstPartyTypeKind["ZodVoid"] = "ZodVoid";
    ZodFirstPartyTypeKind["ZodArray"] = "ZodArray";
    ZodFirstPartyTypeKind["ZodObject"] = "ZodObject";
    ZodFirstPartyTypeKind["ZodUnion"] = "ZodUnion";
    ZodFirstPartyTypeKind["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
    ZodFirstPartyTypeKind["ZodIntersection"] = "ZodIntersection";
    ZodFirstPartyTypeKind["ZodTuple"] = "ZodTuple";
    ZodFirstPartyTypeKind["ZodRecord"] = "ZodRecord";
    ZodFirstPartyTypeKind["ZodMap"] = "ZodMap";
    ZodFirstPartyTypeKind["ZodSet"] = "ZodSet";
    ZodFirstPartyTypeKind["ZodFunction"] = "ZodFunction";
    ZodFirstPartyTypeKind["ZodLazy"] = "ZodLazy";
    ZodFirstPartyTypeKind["ZodLiteral"] = "ZodLiteral";
    ZodFirstPartyTypeKind["ZodEnum"] = "ZodEnum";
    ZodFirstPartyTypeKind["ZodEffects"] = "ZodEffects";
    ZodFirstPartyTypeKind["ZodNativeEnum"] = "ZodNativeEnum";
    ZodFirstPartyTypeKind["ZodOptional"] = "ZodOptional";
    ZodFirstPartyTypeKind["ZodNullable"] = "ZodNullable";
    ZodFirstPartyTypeKind["ZodDefault"] = "ZodDefault";
    ZodFirstPartyTypeKind["ZodCatch"] = "ZodCatch";
    ZodFirstPartyTypeKind["ZodPromise"] = "ZodPromise";
    ZodFirstPartyTypeKind["ZodBranded"] = "ZodBranded";
    ZodFirstPartyTypeKind["ZodPipeline"] = "ZodPipeline";
    ZodFirstPartyTypeKind["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (exports.ZodFirstPartyTypeKind = ZodFirstPartyTypeKind = {}));
// requires TS 4.4+
class Class {
    constructor(..._) { }
}
const instanceOfType = (
// const instanceOfType = <T extends new (...args: any[]) => any>(
cls, params = {
    message: `Input not instance of ${cls.name}`,
}) => custom((data) => data instanceof cls, params);
exports.instanceof = instanceOfType;
const stringType = ZodString.create;
exports.string = stringType;
const numberType = ZodNumber.create;
exports.number = numberType;
const nanType = ZodNaN.create;
exports.nan = nanType;
const bigIntType = ZodBigInt.create;
exports.bigint = bigIntType;
const booleanType = ZodBoolean.create;
exports.boolean = booleanType;
const dateType = ZodDate.create;
exports.date = dateType;
const symbolType = ZodSymbol.create;
exports.symbol = symbolType;
const undefinedType = ZodUndefined.create;
exports.undefined = undefinedType;
const nullType = ZodNull.create;
exports.null = nullType;
const anyType = ZodAny.create;
exports.any = anyType;
const unknownType = ZodUnknown.create;
exports.unknown = unknownType;
const neverType = ZodNever.create;
exports.never = neverType;
const voidType = ZodVoid.create;
exports.void = voidType;
const arrayType = ZodArray.create;
exports.array = arrayType;
const objectType = ZodObject.create;
exports.object = objectType;
const strictObjectType = ZodObject.strictCreate;
exports.strictObject = strictObjectType;
const unionType = ZodUnion.create;
exports.union = unionType;
const discriminatedUnionType = ZodDiscriminatedUnion.create;
exports.discriminatedUnion = discriminatedUnionType;
const intersectionType = ZodIntersection.create;
exports.intersection = intersectionType;
const tupleType = ZodTuple.create;
exports.tuple = tupleType;
const recordType = ZodRecord.create;
exports.record = recordType;
const mapType = ZodMap.create;
exports.map = mapType;
const setType = ZodSet.create;
exports.set = setType;
const functionType = ZodFunction.create;
exports.function = functionType;
const lazyType = ZodLazy.create;
exports.lazy = lazyType;
const literalType = ZodLiteral.create;
exports.literal = literalType;
const enumType = ZodEnum.create;
exports.enum = enumType;
const nativeEnumType = ZodNativeEnum.create;
exports.nativeEnum = nativeEnumType;
const promiseType = ZodPromise.create;
exports.promise = promiseType;
const effectsType = ZodEffects.create;
exports.effect = effectsType;
exports.transformer = effectsType;
const optionalType = ZodOptional.create;
exports.optional = optionalType;
const nullableType = ZodNullable.create;
exports.nullable = nullableType;
const preprocessType = ZodEffects.createWithPreprocess;
exports.preprocess = preprocessType;
const pipelineType = ZodPipeline.create;
exports.pipeline = pipelineType;
const ostring = () => stringType().optional();
exports.ostring = ostring;
const onumber = () => numberType().optional();
exports.onumber = onumber;
const oboolean = () => booleanType().optional();
exports.oboolean = oboolean;
exports.coerce = {
    string: ((arg) => ZodString.create({ ...arg, coerce: true })),
    number: ((arg) => ZodNumber.create({ ...arg, coerce: true })),
    boolean: ((arg) => ZodBoolean.create({
        ...arg,
        coerce: true,
    })),
    bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
    date: ((arg) => ZodDate.create({ ...arg, coerce: true })),
};
exports.NEVER = parseUtil_1.INVALID;

},
"node_modules/zod/lib/ZodError.js":function(module,exports,__load){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZodError = exports.quotelessJson = exports.ZodIssueCode = void 0;
const util_1 = __load("node_modules/zod/lib/helpers/util.js");
exports.ZodIssueCode = util_1.util.arrayToEnum([
    "invalid_type",
    "invalid_literal",
    "custom",
    "invalid_union",
    "invalid_union_discriminator",
    "invalid_enum_value",
    "unrecognized_keys",
    "invalid_arguments",
    "invalid_return_type",
    "invalid_date",
    "invalid_string",
    "too_small",
    "too_big",
    "invalid_intersection_types",
    "not_multiple_of",
    "not_finite",
]);
const quotelessJson = (obj) => {
    const json = JSON.stringify(obj, null, 2);
    return json.replace(/"([^"]+)":/g, "$1:");
};
exports.quotelessJson = quotelessJson;
class ZodError extends Error {
    get errors() {
        return this.issues;
    }
    constructor(issues) {
        super();
        this.issues = [];
        this.addIssue = (sub) => {
            this.issues = [...this.issues, sub];
        };
        this.addIssues = (subs = []) => {
            this.issues = [...this.issues, ...subs];
        };
        const actualProto = new.target.prototype;
        if (Object.setPrototypeOf) {
            // eslint-disable-next-line ban/ban
            Object.setPrototypeOf(this, actualProto);
        }
        else {
            this.__proto__ = actualProto;
        }
        this.name = "ZodError";
        this.issues = issues;
    }
    format(_mapper) {
        const mapper = _mapper ||
            function (issue) {
                return issue.message;
            };
        const fieldErrors = { _errors: [] };
        const processError = (error) => {
            for (const issue of error.issues) {
                if (issue.code === "invalid_union") {
                    issue.unionErrors.map(processError);
                }
                else if (issue.code === "invalid_return_type") {
                    processError(issue.returnTypeError);
                }
                else if (issue.code === "invalid_arguments") {
                    processError(issue.argumentsError);
                }
                else if (issue.path.length === 0) {
                    fieldErrors._errors.push(mapper(issue));
                }
                else {
                    let curr = fieldErrors;
                    let i = 0;
                    while (i < issue.path.length) {
                        const el = issue.path[i];
                        const terminal = i === issue.path.length - 1;
                        if (!terminal) {
                            curr[el] = curr[el] || { _errors: [] };
                            // if (typeof el === "string") {
                            //   curr[el] = curr[el] || { _errors: [] };
                            // } else if (typeof el === "number") {
                            //   const errorArray: any = [];
                            //   errorArray._errors = [];
                            //   curr[el] = curr[el] || errorArray;
                            // }
                        }
                        else {
                            curr[el] = curr[el] || { _errors: [] };
                            curr[el]._errors.push(mapper(issue));
                        }
                        curr = curr[el];
                        i++;
                    }
                }
            }
        };
        processError(this);
        return fieldErrors;
    }
    static assert(value) {
        if (!(value instanceof ZodError)) {
            throw new Error(`Not a ZodError: ${value}`);
        }
    }
    toString() {
        return this.message;
    }
    get message() {
        return JSON.stringify(this.issues, util_1.util.jsonStringifyReplacer, 2);
    }
    get isEmpty() {
        return this.issues.length === 0;
    }
    flatten(mapper = (issue) => issue.message) {
        const fieldErrors = {};
        const formErrors = [];
        for (const sub of this.issues) {
            if (sub.path.length > 0) {
                fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
                fieldErrors[sub.path[0]].push(mapper(sub));
            }
            else {
                formErrors.push(mapper(sub));
            }
        }
        return { formErrors, fieldErrors };
    }
    get formErrors() {
        return this.flatten();
    }
}
exports.ZodError = ZodError;
ZodError.create = (issues) => {
    const error = new ZodError(issues);
    return error;
};

}};
const __cache={};function __load(id){if(__cache[id])return __cache[id].exports;const module={exports:{}};__cache[id]=module;__modules[id](module,module.exports,__load);return module.exports;}return Object.assign({},__load("dist/runtime/gas-pure.js"));
})();

/**
 * GitHub Git Data API append-only, content-addressed event store for GAS.
 * The supplied data repository/branch MUST be a dedicated private data target.
 * No install or credential acquisition. No automatic write from triggers.
 *
 * Each commit creates an immutable event blob and advances a small manifest.
 * Non-force ref update rejects competing sibling commits (server fast-forward
 * check). A lost response is UNKNOWN, never a permission to try again.
 */
function rc11GitDataStore_(fetcher, options, codec) {
  if (!fetcher || typeof fetcher.fetch !== 'function' ||
      !options || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(options.repo || '') ||
      !/^rc11-[a-z0-9-]{1,55}$/.test(options.branch || '') ||
      typeof options.token !== 'string' || options.token.length < 16 ||
      typeof options.installId !== 'string' || !/^[A-Za-z0-9_-]{8,100}$/.test(options.installId) ||
      typeof options.epoch !== 'string' || !/^[A-Za-z0-9_-]{8,100}$/.test(options.epoch) ||
      !codec || typeof codec.sha256 !== 'function' ||
      typeof codec.decode !== 'function') throw Error('GIT_DATA_CONFIGURATION_HOLD');

  const root = 'https://api.github.com/repos/' + options.repo;
  const branch = options.branch;
  function api(method, path, payload) {
    const args = {
      method: method.toLowerCase(),
      headers: {
        Authorization: 'Bearer ' + options.token,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      muteHttpExceptions: true, followRedirects: false
    };
    if (payload !== undefined) {
      args.contentType = 'application/json';
      args.payload = JSON.stringify(payload);
    }
    const res = fetcher.fetch(root + path, args);
    const status = res.getResponseCode();
    if (status < 200 || status >= 300) throw Error('GITHUB_HTTP_' + status);
    const text = res.getContentText();
    if (typeof text !== 'string' || text.length > 2000000) throw Error('GITHUB_RESPONSE_LIMIT');
    const value = JSON.parse(text);
    if (value === null || typeof value !== 'object') throw Error('GITHUB_RESPONSE_SHAPE');
    return value;
  }
  const sha40 = value => typeof value === 'string' && /^[a-f0-9]{40}$/.test(value);
  function validateState(state) {
    if (!state || state.version !== 1 || state.installId !== options.installId ||
        state.epoch !== options.epoch || !Number.isSafeInteger(state.sequence) ||
        state.sequence < 0 || !Array.isArray(state.events) ||
        state.sequence !== state.events.length ||
        typeof state.writerEnabled !== 'boolean') throw Error('GITHUB_STATE_HOLD');
    const unique = new Set();
    for (let i=0;i<state.events.length;i++) {
      const entry=state.events[i];
      if (!entry || typeof entry.id !== 'string' || entry.id.length > 160 ||
          !/^[a-f0-9]{64}$/.test(entry.digest) || !sha40(entry.blob) ||
          !/^data\/events\/[0-9]{8}\.json$/.test(entry.path) ||
          entry.path !== 'data/events/' + String(i+1).padStart(8,'0') + '.json' ||
          unique.has(entry.id) ||
          (entry.targetHash!==undefined && entry.targetHash!==null &&
            !/^[a-f0-9]{64}$/.test(entry.targetHash))) throw Error('GITHUB_EVENT_INDEX_HOLD');
      unique.add(entry.id);
    }
    return state;
  }
  const blobCache=new Map();
  function readBlob(sha){if(!blobCache.has(sha)){const b=api('get','/git/blobs/'+sha);if(b.encoding!=='base64')throw Error('BLOB_ENCODING');blobCache.set(sha,codec.decode(b.content.replace(/\s/g,'')));}return blobCache.get(sha);}
  function read() {
    const ref = api('get','/git/ref/heads/'+branch);
    if (!ref.object || !sha40(ref.object.sha)) throw Error('GITHUB_REF_HOLD');
    const commit = api('get','/git/commits/'+ref.object.sha);
    if (!commit.tree || !sha40(commit.tree.sha)) throw Error('GITHUB_TREE_HOLD');
    const entry = api('get','/contents/data/state.json?ref='+ref.object.sha);
    if (entry.encoding !== 'base64' || typeof entry.content !== 'string') throw Error('GITHUB_CONTENT_HOLD');
    const decoded = codec.decode(entry.content.replace(/\s/g,''));
    if (decoded.length > 850000) throw Error('GITHUB_STATE_SIZE_HOLD');
    const compact=JSON.parse(decoded);
    const pages=compact.eventPages||[];
    if(pages.length){let refs=[];for(const page of pages){const raw=readBlob(page.blob);if(codec.sha256(raw)!==page.digest)throw Error('INDEX_PAGE_HASH');const rows=JSON.parse(raw);if(!Array.isArray(rows)||rows.length!==page.count)throw Error('INDEX_PAGE_COUNT');refs=refs.concat(rows);}compact.events=refs.concat(compact.events);}
    const state = validateState(compact);
    return {head:ref.object.sha,tree:commit.tree.sha,state:state};
  }
  /** Only established, owner-approved writer epochs may append.
   * Testing must provide a separate disposable branch and mock HTTP.
   */
  function append(record, expectedHead) {
    if (!record || typeof record !== 'object' || typeof record.id !== 'string' ||
        !/^[A-Za-z0-9:_-]{1,160}$/.test(record.id) ||
        !['REPORT','CORRECTION','RETRACTION','INTENT','RECEIPT','PLAN','DIAGNOSTIC','INPUTS','MOVE_INTENT','MOVE_RECEIPT','MIGRATION_RECORD','LEGACY_STATE_BATCH','LEGACY_SEAL'].includes(record.kind) ||
        typeof record.raw !== 'string' || record.raw.length > 20000000 ||
        record.executionAuthorized !== false ||
        (record.targetHash!==undefined && !/^[a-f0-9]{64}$/.test(record.targetHash))) return {status:'HOLD',reason:'INVALID_EVENT'};
    let snapshot;
    try {snapshot=read();} catch {return {status:'HOLD',reason:'GIT_STORAGE_READ_HOLD'};}
    if (expectedHead !== undefined && snapshot.head !== expectedHead)
      return {status:'HOLD',reason:'SOURCE_GENERATION_CHANGED'};
    if (!snapshot.state.writerEnabled || options.enableWrites !== true)
      return {status:'HOLD',reason:'WRITER_NOT_APPROVED'};
    const payload = JSON.stringify(record);
    const digest = codec.sha256(payload);
    const prior = snapshot.state.events.find(x=>x.id===record.id);
    if (prior) return prior.digest===digest ?
      {status:'DUPLICATE',sequence:snapshot.state.sequence,head:snapshot.head} :
      {status:'HOLD',reason:'EVENT_ID_CONFLICT'};
    const n=snapshot.state.sequence+1;
    const path='data/events/'+String(n).padStart(8,'0')+'.json';
    // Staging blobs and trees is harmless until the final ref update, but a
    // network failure may mean a remote write happened. Never auto-resubmit.
    try {
      let wire=record;const linkedBlobs=[];
      if(record.raw.length>90000){const parts=[];for(let at=0;at<record.raw.length;){let end=Math.min(at+250000,record.raw.length);if(end<record.raw.length&&/[\uD800-\uDBFF]/.test(record.raw[end-1]))end--;const body=record.raw.slice(at,end);at=end;const part=api('post','/git/blobs',{content:body,encoding:'utf-8'});if(!sha40(part.sha))throw Error('LARGE_EVENT_CHUNK');parts.push({blob:part.sha,digest:codec.sha256(body)});linkedBlobs.push({path:'data/chunks/'+part.sha+'.txt',mode:'100644',type:'blob',sha:part.sha});blobCache.set(part.sha,body);}wire={...record,raw:'',rawParts:parts};}
      const eventBlob=api('post','/git/blobs',{content:JSON.stringify(wire),encoding:'utf-8'});
      blobCache.set(eventBlob.sha,JSON.stringify(wire));
      if (!sha40(eventBlob.sha)) throw Error('GITHUB_EVENT_BLOB_HOLD');
      const next=JSON.parse(JSON.stringify(snapshot.state));
      next.sequence=n;
      next.events.push({id:record.id,path,blob:eventBlob.sha,digest,
        ...(typeof record.targetHash==='string'?{targetHash:record.targetHash}:{})});
      const pages=next.eventPages||[];
      let tail=next.events.slice(pages.reduce((n,p)=>n+p.count,0));
      while(tail.length>256){const rows=tail.splice(0,256),body=JSON.stringify(rows);const part=api('post','/git/blobs',{content:body,encoding:'utf-8'});if(!sha40(part.sha))throw Error('INDEX_PAGE_WRITE');pages.push({blob:part.sha,digest:codec.sha256(body),count:rows.length});linkedBlobs.push({path:'data/index/'+part.sha+'.json',mode:'100644',type:'blob',sha:part.sha});blobCache.set(part.sha,body);}
      next.eventPages=pages;next.events=tail;
      const stateJson=JSON.stringify(next);
      if (stateJson.length > 850000) return {status:'HOLD',reason:'STATE_MANIFEST_CAPACITY_HOLD'};
      const stateBlob=api('post','/git/blobs',{content:stateJson,encoding:'utf-8'});
      if (!sha40(stateBlob.sha)) throw Error('GITHUB_STATE_BLOB_HOLD');
      const tree=api('post','/git/trees',{
        base_tree:snapshot.tree,
        tree:[
          {path,mode:'100644',type:'blob',sha:eventBlob.sha},
          {path:'data/state.json',mode:'100644',type:'blob',sha:stateBlob.sha},...linkedBlobs
        ]
      });
      if (!sha40(tree.sha)) throw Error('GITHUB_NEW_TREE_HOLD');
      const commit=api('post','/git/commits',{
        message:'rc11 data event '+n,
        tree:tree.sha,parents:[snapshot.head]
      });
      if (!sha40(commit.sha)) throw Error('GITHUB_NEW_COMMIT_HOLD');
      const advanced=api('patch','/git/refs/heads/'+branch,{sha:commit.sha,force:false});
      if (!advanced.object || advanced.object.sha !== commit.sha)
        throw Error('GITHUB_REF_READBACK_HOLD');
      const check=read();
      if (check.head!==commit.sha ||
          !check.state.events.some(x=>x.id===record.id&&x.digest===digest))
        return {status:'UNKNOWN',reason:'COMMIT_READBACK_UNCERTAIN'};
      return {status:'COMMITTED',sequence:n,head:commit.sha};
    } catch {
      return {status:'UNKNOWN',reason:'GIT_APPEND_OUTCOME_UNCERTAIN'};
    }
  }

  /** Persistent whole-state CAS port compatible with the original
   * JournalBackend contract. A storage or network UNKNOWN throws rather than
   * returning false, preventing unsafe blind resubmission after a lost reply.
   */
  function readNative() {
    const snap=read(),ptr=snap.state.native;
    if (ptr===undefined || ptr===null) return null;
    if(!sha40(ptr.blob)||!/^[a-f0-9]{64}$/.test(ptr.digest))
      throw Error('GITHUB_NATIVE_POINTER_HOLD');
    const blob=api('get','/git/blobs/'+ptr.blob);
    if(blob.encoding!=='base64'||typeof blob.content!=='string')
      throw Error('GITHUB_NATIVE_BLOB_HOLD');
    const body=codec.decode(blob.content.replace(/\s/g,''));
    if(codec.sha256(body)!==ptr.digest)throw Error('GITHUB_NATIVE_HASH_HOLD');
    return body;
  }
  function compareAndSwapNative(expected,next) {
    if(next===null||typeof next!=='string'||next.length>800000||
      (expected!==null&&typeof expected!=='string'))
      throw Error('GITHUB_NATIVE_CAS_INVALID');
    const snapshot=read();
    if(!snapshot.state.writerEnabled||options.enableWrites!==true)
      throw Error('GITHUB_NATIVE_WRITER_NOT_APPROVED');
    const ptr=snapshot.state.native;
    let old=null;
    if(ptr!==undefined&&ptr!==null){
      if(!sha40(ptr.blob)||!/^[a-f0-9]{64}$/.test(ptr.digest))
        throw Error('GITHUB_NATIVE_POINTER_HOLD');
      const blob=api('get','/git/blobs/'+ptr.blob);
      old=codec.decode(blob.content.replace(/\s/g,''));
      if(codec.sha256(old)!==ptr.digest)throw Error('GITHUB_NATIVE_HASH_HOLD');
    }
    if(old!==expected)return false;
    const artifact=api('post','/git/blobs',{content:next,encoding:'utf-8'});
    if(!sha40(artifact.sha))throw Error('GITHUB_NATIVE_BLOB_WRITE_HOLD');
    const state=JSON.parse(JSON.stringify(snapshot.state));
    state.native={blob:artifact.sha,digest:codec.sha256(next)};
    if(state.eventPages?.length)state.events=state.events.slice(state.eventPages.reduce((n,p)=>n+p.count,0));
    const newState=JSON.stringify(state);
    if(newState.length>850000)throw Error('GITHUB_MANIFEST_SIZE_HOLD');
    const manifest=api('post','/git/blobs',{content:newState,encoding:'utf-8'});
    if(!sha40(manifest.sha))throw Error('GITHUB_MANIFEST_BLOB_HOLD');
    const tree=api('post','/git/trees',{base_tree:snapshot.tree,
      tree:[{path:'data/native.json',mode:'100644',type:'blob',sha:artifact.sha},
        {path:'data/state.json',mode:'100644',type:'blob',sha:manifest.sha}]});
    if(!sha40(tree.sha))throw Error('GITHUB_TREE_WRITE_HOLD');
    const commit=api('post','/git/commits',{message:'rc11 native CAS',
      tree:tree.sha,parents:[snapshot.head]});
    if(!sha40(commit.sha))throw Error('GITHUB_COMMIT_WRITE_HOLD');
    // 409/422 may represent an actual race; but without a readback fence we
    // never claim false=known-not-written after network ambiguity.
    const updated=api('patch','/git/refs/heads/'+branch,{sha:commit.sha,force:false});
    if(!updated.object||updated.object.sha!==commit.sha)
      throw Error('GITHUB_NATIVE_UPDATE_UNKNOWN');
    const verify=read();
    if(verify.head!==commit.sha||readNative()!==next)
      throw Error('GITHUB_NATIVE_READBACK_UNKNOWN');
    return true;
  }
  function nativeBackend() {
    return {read:async()=>readNative(),compareAndSwap:async(a,b)=>compareAndSwapNative(a,b)};
  }

  /** Read committed event by SHA, never by mutable path. */
  function readEvent(entry) {
    if (!entry || !sha40(entry.blob) || !/^[a-f0-9]{64}$/.test(entry.digest))
      throw Error('GITHUB_EVENT_REF_HOLD');
    const decoded=readBlob(entry.blob);
    let record=JSON.parse(decoded);
    if(Array.isArray(record.rawParts)){let raw='';for(const p of record.rawParts){const body=readBlob(p.blob);if(codec.sha256(body)!==p.digest)throw Error('EVENT_CHUNK_HASH');raw+=body;}const {rawParts,...rest}=record;record={...rest,raw};}
    if (codec.sha256(JSON.stringify(record))!==entry.digest) throw Error('GITHUB_EVENT_HASH_HOLD');
    if (record.id!==entry.id || record.executionAuthorized!==false ||
        record.targetHash!==entry.targetHash)
      throw Error('GITHUB_EVENT_CONTENT_HOLD');
    return record;
  }
  return {read,append,readEvent,readNative,compareAndSwapNative,nativeBackend};
}


/**
 * Todoist Sync v1 single-command qualified transport candidate.
 * It never runs on import and does not inspect OAuth/PropertiesService.
 * Caller MUST persist the exact INTENT in the GitHub CAS ledger first.
 * Any uncertain result is UNKNOWN and MUST NOT be retried automatically.
 */
function rc11TodoistCreateOnce_(fetcher,token,projectId,commandId,task) {
  const validId=s=>typeof s==='string'&&/^[A-Za-z0-9_-]{8,80}$/.test(s)&&!s.startsWith('tmp-');
  const validUuid=s=>typeof s==='string'&&/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(s);
  if (!fetcher||typeof fetcher.fetch!=='function'||!validId(projectId)||
      !validUuid(commandId)||typeof token!=='string'||token.length<16||
      !task||typeof task.content!=='string'||task.content.length<1||
      task.content.length>500||typeof task.description!=='string'||
      !/^RC11_NEXT_ID:[A-Za-z0-9_-]{8,100}$/.test(task.description)||
      !/^\d{4}-\d{2}-\d{2}$/.test(task.dueDate||'')||
      (task.priority!==undefined&&(!Number.isSafeInteger(task.priority)||task.priority<1||task.priority>4)))
    return {status:'HOLD',reason:'INVALID_TODOIST_COMMAND'};
  const command={
    type:'item_add',uuid:commandId,temp_id:commandId,
    args:{content:task.content,project_id:projectId,
      description:task.description,due:{date:task.dueDate},
       ...(task.priority===undefined?{}:{priority:task.priority})}
  };
  const params={
    method:'post',contentType:'application/x-www-form-urlencoded',
    headers:{Authorization:'Bearer '+token,Accept:'application/json'},
    payload:'commands='+encodeURIComponent(JSON.stringify([command])),
    followRedirects:false,muteHttpExceptions:true
  };
  try{
    const response=fetcher.fetch('https://api.todoist.com/api/v1/sync',params);
    if(response.getResponseCode()!==200)return {status:'UNKNOWN',reason:'TODOIST_HTTP_UNCERTAIN'};
    const content=response.getContentText();
    if(typeof content!=='string'||content.length>150000)return {status:'UNKNOWN',reason:'TODOIST_RESPONSE_SIZE'};
    const parsed=JSON.parse(content);
    const observed=parsed?.sync_status?.[commandId];
    const remoteId=parsed?.temp_id_mapping?.[commandId];
    if(observed!=='ok'||!validId(remoteId))
      return {status:'UNKNOWN',reason:'TODOIST_RESULT_UNCONFIRMED'};
    return {status:'ACK',commandId,remoteId};
  }catch {
    return {status:'UNKNOWN',reason:'TODOIST_RESPONSE_LOST'};
  }
}
/** Deterministic UUID from a stable operation fingerprint, never regenerated
 * on retries. UUID uniqueness is scoped by an owner-approved writer epoch.
 */
function rc11TodoistCommandId_(sha256) {
  if(typeof sha256!=='string'||!/^[a-f0-9]{64}$/.test(sha256))throw Error('TODOIST_COMMAND_HASH');
  const a=sha256.slice(0,32);
  return a.slice(0,8)+'-'+a.slice(8,12)+'-'+a.slice(12,16)+'-'+a.slice(16,20)+'-'+a.slice(20);
}

/** Change a previously ACKed managed task in its existing project. A date-only
 * change is MOVE; changed title/date is UPDATE. Never retry an uncertain send. */
function rc11TodoistUpdateOnce_(fetcher,token,projectId,remoteId,commandId,task) {
  const id=s=>typeof s==='string'&&/^[A-Za-z0-9_-]{8,80}$/.test(s);
  const uuid=s=>typeof s==='string'&&/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(s);
  if (!fetcher||typeof fetcher.fetch!=='function'||!id(projectId)||!id(remoteId)||
      !uuid(commandId)||typeof token!=='string'||token.length<16||
      !task||typeof task.content!=='string'||task.content.length<1||task.content.length>500||
      typeof task.description!=='string'||!/^RC11_NEXT_ID:[A-Za-z0-9_-]{8,100}$/.test(task.description)||
      !/^\d{4}-\d{2}-\d{2}$/.test(task.dueDate||'')||
      (task.priority!==undefined&&(!Number.isSafeInteger(task.priority)||task.priority<1||task.priority>4)))
    return {status:'HOLD',reason:'INVALID_UPDATE_COMMAND'};
  const command={type:'item_update',uuid:commandId,args:{
    id:remoteId,content:task.content,description:task.description,due:{date:task.dueDate},
    ...(task.priority===undefined?{}:{priority:task.priority})
  }};
  try {
    const response=fetcher.fetch('https://api.todoist.com/api/v1/sync',{
      method:'post',contentType:'application/x-www-form-urlencoded',
      headers:{Authorization:'Bearer '+token,Accept:'application/json'},
      payload:'commands='+encodeURIComponent(JSON.stringify([command])),
      followRedirects:false,muteHttpExceptions:true
    });
    if(response.getResponseCode()!==200)return {status:'UNKNOWN',reason:'TODOIST_UPDATE_HTTP_UNCERTAIN'};
    const body=response.getContentText();
    if(typeof body!=='string'||body.length>150000)return {status:'UNKNOWN',reason:'TODOIST_UPDATE_RESPONSE_SIZE'};
    const data=JSON.parse(body);
    return data&&data.sync_status&&data.sync_status[commandId]==='ok'
      ?{status:'ACK',commandId,remoteId}
      :{status:'UNKNOWN',reason:'TODOIST_UPDATE_NOT_CONFIRMED'};
  }catch{return {status:'UNKNOWN',reason:'TODOIST_UPDATE_RESPONSE_LOST'};}
}
/** Single-task read before UPDATE/MOVE; caller checks project, marker and fields. */
function rc11TodoistReadOne_(fetcher,token,taskId) {
  if(!fetcher||typeof fetcher.fetch!=='function'||typeof token!=='string'||token.length<16||
     typeof taskId!=='string'||!/^[A-Za-z0-9_-]{8,80}$/.test(taskId))
    return {status:'HOLD',reason:'INVALID_TASK_READ'};
  try {
    const r=fetcher.fetch('https://api.todoist.com/api/v1/tasks/'+encodeURIComponent(taskId),{
      method:'get',headers:{Authorization:'Bearer '+token,Accept:'application/json'},
      followRedirects:false,muteHttpExceptions:true
    });
    if(r.getResponseCode()!==200)return {status:'HOLD',reason:'REMOTE_TASK_NOT_VERIFIED'};
    const raw=r.getContentText();
    if(typeof raw!=='string'||raw.length>100000)return {status:'HOLD',reason:'REMOTE_TASK_TOO_LARGE'};
    const task=JSON.parse(raw);
    if(!task||typeof task!=='object'||task.id!==taskId)return {status:'HOLD',reason:'REMOTE_ID_MISMATCH'};
    return {status:'ready',task};
  }catch{return {status:'HOLD',reason:'REMOTE_TASK_READ_UNCERTAIN'};}
}

/**
 * Audit-candidate execution and reconciliation fences for the GAS-only port.
 * These guards NEVER grant production authority or automatically retry a
 * Todoist command. A read of a paginated Todoist API is not an atomic snapshot.
 */

/** Deny old plans after any new learning evidence, superseding plan or unknown
 * authority event. Only INTENT and RECEIPT may follow a still-current plan.
 * The GitHub CAS is the only generation anchor; client input cannot override it.
 */
function rc11NextPlanFence_(snapshot,planHash,approvedSource) {
  if (!snapshot || !snapshot.state || !Array.isArray(snapshot.state.events) ||
      typeof snapshot.head!=='string' ||
      typeof planHash!=='string' || !/^[a-f0-9]{64}$/.test(planHash) ||
      typeof approvedSource!=='string' || !/^[a-f0-9]{40}$/.test(approvedSource))
    return {status:'HOLD',reason:'PLAN_FENCE_INVALID'};
  const events=snapshot.state.events;
  const index=events.findIndex(x=>x && x.id==='plan:'+planHash);
  if(index<0)return {status:'HOLD',reason:'PLAN_NOT_PERSISTED'};
  // Only a trusted, persisted plan may claim its approved source. The caller
  // must independently read and verify the signed-off PLAN event itself.
  const unsafe=events.slice(index+1).some(x=>{
    if(!x || typeof x.id!=='string')return true;
    return !x.id.startsWith('intent:') && !x.id.startsWith('receipt:') &&
      !x.id.startsWith('diagnostic:') && !x.id.startsWith('move-intent:') && !x.id.startsWith('move-receipt:');
  });
  if(unsafe)return {status:'HOLD',reason:'PLAN_STALE_OR_SUPERSEDED'};
  return {status:'CURRENT_PLAN_LEDGER',eventIndex:index,sourceCommit:approvedSource,
    executionAuthorized:false};
}

/** Read-only reconciliation of a previously stored Todoist CREATE intent.
 * Never auto-create, retry, move, delete, complete or synthesize a receipt.
 * A matching remote task is evidence to REVIEW, not proof of an atomic scan.
 */
function rc11NextReconcileIsolatedTask(planHash,groupId) {
  try {
    if(typeof planHash!=='string'||!/^[a-f0-9]{64}$/.test(planHash)||
       typeof groupId!=='string'||groupId.length<1||groupId.length>4096||/[\u0000-\u001F\u007F]/.test(groupId))
      return {status:'HOLD',reason:'INVALID_RECONCILIATION_KEY'};
    const {config,store}=rc11NextGasStore_();
    if(!config.todoistProject || !config.todoistToken ||
       config.todoistToken.length<16)
      return {status:'HOLD',reason:'NO_APPROVED_TODOIST_READ_SCOPE'};
    const snap=store.read();
    const key=rc11NextGasCodec_().sha256(JSON.stringify([config.epoch,planHash,groupId]));
    const identifier='todoist:'+key;
    const intentRef=snap.state.events.find(e=>e.id==='intent:'+identifier);
    if(!intentRef){
      const planRef=snap.state.events.find(e=>e.id==='plan:'+planHash);
      if(planRef){
        const saved=store.readEvent(planRef);
        if(saved.kind!=='PLAN'||rc11NextGasCodec_().sha256(saved.raw)!==planHash)
          return {status:'HOLD',reason:'RECONCILIATION_PLAN_INVALID'};
        const group=JSON.parse(saved.raw).groups.find(g=>g.groupId===groupId);
        if(group){
          const prior=rc11NextPriorOwnership_(store,snap,group.occurrenceIds);
          if(prior.length)return {status:'HOLD',reason:'PRIOR_PLAN_RECONCILIATION_REQUIRED',
            priorIntents:prior,executionAuthorized:false};
        }
      }
      return {status:'HOLD',reason:'NO_PERSISTED_INTENT'};
    }
    const intentEvent=store.readEvent(intentRef);
    if(intentEvent.kind!=='INTENT')return {status:'HOLD',reason:'INVALID_INTENT_EVENT'};
    const intent=JSON.parse(intentEvent.raw);
    if(intent.planHash!==planHash||intent.groupId!==groupId||
       intent.uuid!==rc11TodoistCommandId_(key) ||
       intent.projectId!==config.todoistProject ||
       !intent.task || typeof intent.task.content!=='string' ||
       intent.task.description!=='RC11_NEXT_ID:'+key.slice(0,32) ||
       !/^\d{4}-\d{2}-\d{2}$/.test(intent.task.dueDate||''))
      return {status:'HOLD',reason:'INTENT_CONTENT_MISMATCH'};
    const receiptRefs=snap.state.events.filter(e=>e.id==='receipt:'+identifier);
    if(receiptRefs.length>1)return {status:'HOLD',reason:'DUPLICATE_RECEIPT_REFERENCE'};
    let recorded=null;
    if(receiptRefs.length){
      const r=store.readEvent(receiptRefs[0]);
      if(r.kind!=='RECEIPT')return {status:'HOLD',reason:'INVALID_RECEIPT_EVENT'};
      recorded=JSON.parse(r.raw);
      if(recorded.planHash!==planHash||recorded.groupId!==groupId||
         recorded.uuid!==intent.uuid ||
         !recorded.outcome || !['ACK','UNKNOWN'].includes(recorded.outcome.status))
        return {status:'HOLD',reason:'RECEIPT_CONTENT_MISMATCH'};
    }
    const inventory=RC11Next.readTodoistInventory(UrlFetchApp,config.todoistToken,
      config.todoistProject,20);
    if(inventory.status!=='read-only'||!Array.isArray(inventory.tasks))
      return {status:'HOLD',reason:'INVENTORY_UNAVAILABLE',
        inventoryReason:inventory.reason||'UNKNOWN',executionAuthorized:false};
    const matched=inventory.tasks.filter(t=>
      t.description===intent.task.description);
    if(matched.length>1)return {status:'HOLD',reason:'DUPLICATE_REMOTE_MATCH',
      executionAuthorized:false};
    if(matched.length===0)return {status:'UNKNOWN',reason:'NOT_OBSERVED_NOT_PROOF_OF_ABSENCE',
      priorReceipt:recorded?.outcome?.status||'NONE',
      snapshotComplete:false,executionAuthorized:false};
    const remote=matched[0];
    if(remote.project_id!==config.todoistProject||
       remote.content!==intent.task.content||
       remote.due?.date!==intent.task.dueDate)
      return {status:'HOLD',reason:'REMOTE_TASK_CONTENT_CONFLICT',
        snapshotComplete:false,executionAuthorized:false};
    if(recorded?.outcome?.status==='ACK' && recorded.outcome.remoteId!==remote.id)
      return {status:'HOLD',reason:'ACK_REMOTE_ID_CONFLICT',
        snapshotComplete:false,executionAuthorized:false};
    return {status:recorded?.outcome?.status==='ACK'
      ? 'ACK_OBSERVED_READ_ONLY':'REMOTE_MATCH_REVIEW_REQUIRED',
      remoteId:remote.id,priorReceipt:recorded?.outcome?.status||'NONE',
      snapshotComplete:false,executionAuthorized:false};
  }catch {
    return {status:'HOLD',reason:'RECONCILIATION_EVIDENCE_UNVERIFIED',
      executionAuthorized:false};
  }
}

/** All native GAS mutable entrypoints share this script lock. Dependency-injected
 * adapters may supply their own synchronization; native config always requires
 * LockService. This is NOT a fence for foreign scripts or direct Git writers. */
function rc11NextWithWriterLock_(config,operation) {
  if(config.requiresWriterLock!==true)return operation();
  if(typeof LockService==='undefined')return {status:'HOLD',reason:'WRITER_LOCK_UNAVAILABLE'};
  const lock=LockService.getScriptLock();
  if(!lock.tryLock(1000))return {status:'HOLD',reason:'WRITER_LOCK_BUSY'};
  try{
    const current=rc11NextOwnerConfig_();
    if(Object.keys(config).some(k=>current[k]!==config[k]))
      return {status:'HOLD',reason:'WRITER_AUTHORITY_CHANGED_WHILE_WAITING'};
    return operation();
  }finally{lock.releaseLock();}
}

/** Until the full correction resolver is ported, unresolved evidence blocks the
 * whole projection. Read and validate records before trusting target indexes.
 * A malformed or unscoped correction must not be ignored as an unrelated target. */
function rc11NextReadHistory_(store,snapshot) {
  const reports=new Map();
  const prefixes={REPORT:'report:',PLAN:'plan:',INTENT:'intent:',RECEIPT:'receipt:',DIAGNOSTIC:'diagnostic:',INPUTS:'inputs:',MOVE_INTENT:'move-intent:',MOVE_RECEIPT:'move-receipt:',MIGRATION_RECORD:'migration:',LEGACY_STATE_BATCH:'legacy-batch:',LEGACY_SEAL:'legacy-seal:'};
  for(const ref of snapshot.state.events) {
    const event=store.readEvent(ref);
    if(!event||event.id!==ref.id||event.executionAuthorized!==false)
      throw Error('HISTORY_EVENT_UNVERIFIED');
    if(event.kind==='CORRECTION'||event.kind==='RETRACTION')
      throw Error('UNRESOLVED_CORRECTION_OR_RETRACTION');
    if(!prefixes[event.kind]||!event.id.startsWith(prefixes[event.kind]))
      throw Error('HISTORY_KIND_UNVERIFIED');
    if(event.kind!=='REPORT')continue;
    const saved=JSON.parse(event.raw),p=saved?.problem;
    if(!p||typeof saved.raw!=='string')throw Error('REPORT_SHAPE_UNVERIFIED');
    const hash=rc11NextGasCodec_().sha256(JSON.stringify([
      p.materialId,p.editionId,p.problemKind,p.problemNumber,p.subquestionPath]));
    if(event.targetHash!==hash||ref.targetHash!==hash)throw Error('REPORT_TARGET_INDEX_MISMATCH');
    const list=reports.get(hash)||[];
    if(list.length>=100)throw Error('REPLAY_WORKING_SET_LIMIT');
    list.push(saved);reports.set(hash,list);
  }
  return reports;
}

/** Durable occurrence ownership is independent of plan hash, group and epoch.
 * Old intents derive membership from their immutable original plan. Missing
 * evidence blocks CREATE; ACK/UNKNOWN/completion never releases ownership. */
function rc11NextPriorOwnership_(store,snapshot,occurrenceIds) {
  if(!Array.isArray(occurrenceIds)||!occurrenceIds.length||
    occurrenceIds.some(x=>typeof x!=='string'||!x.length)||
    new Set(occurrenceIds).size!==occurrenceIds.length)
    throw Error('OWNERSHIP_MEMBERSHIP_INVALID');
  const wanted=new Set(occurrenceIds),matches=[];
  for(const ref of snapshot.state.events) {
    const event=store.readEvent(ref);
    const prefixes={REPORT:'report:',PLAN:'plan:',INTENT:'intent:',RECEIPT:'receipt:',DIAGNOSTIC:'diagnostic:',INPUTS:'inputs:',MOVE_INTENT:'move-intent:',MOVE_RECEIPT:'move-receipt:',MIGRATION_RECORD:'migration:',LEGACY_STATE_BATCH:'legacy-batch:',LEGACY_SEAL:'legacy-seal:'};
    if(!event||!prefixes[event.kind]||!ref.id.startsWith(prefixes[event.kind]))
      throw Error('OWNERSHIP_HISTORY_UNVERIFIED');
    if(event.kind!=='INTENT')continue;
    const data=JSON.parse(event.raw);
    const planRef=snapshot.state.events.find(e=>e.id==='plan:'+data.planHash);
    if(!planRef)throw Error('OWNERSHIP_PLAN_MISSING');
    const saved=store.readEvent(planRef);
    if(saved.kind!=='PLAN'||rc11NextGasCodec_().sha256(saved.raw)!==data.planHash)
      throw Error('OWNERSHIP_PLAN_INVALID');
    const groups=JSON.parse(saved.raw).groups;
    if(!Array.isArray(groups))throw Error('OWNERSHIP_PLAN_INVALID');
    const groupsFound=groups.filter(g=>g.groupId===data.groupId);
    if(groupsFound.length!==1)throw Error('OWNERSHIP_GROUP_INVALID');
    const members=groupsFound[0].occurrenceIds;
    if(!Array.isArray(members)||!members.length||new Set(members).size!==members.length||
      members.some(x=>typeof x!=='string'||!x.length))throw Error('OWNERSHIP_MEMBERSHIP_INVALID');
    if(data.occurrenceIds!==undefined &&
      JSON.stringify(data.occurrenceIds)!==JSON.stringify(members))throw Error('OWNERSHIP_MEMBER_CONFLICT');
    if(members.some(id=>wanted.has(id)))matches.push({intentId:ref.id,planHash:data.planHash,
      groupId:data.groupId,occurrenceIds:members});
  }
  return matches;
}

/**
 * GAS composition for the existing RC11 v0.3 engine. Nothing executes on load.
 * This is NOT an Apps Script web app: no doPost/doGet, public endpoint or trigger installer.
 * Every mutable entrypoint requires owner identity and explicit deployment gates.
 */
// Independent Astra audit and owner cutover are mandatory before any real writer.
// A production release needs a separately reviewed code change, not just properties.
const RC11_GAS_RELEASE_APPROVED = false;
function rc11NextGasCodec_() {
  if (typeof Utilities==='undefined') throw Error('GAS_UTILITIES_UNAVAILABLE');
  const hash=text=>{
    const bytes=Utilities.newBlob(text).getBytes();
    const digest=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,bytes);
    return digest.map(n=>(n&255).toString(16).padStart(2,'0')).join('');
  };
  return {
    sha256:hash,
    decode:text=>{
      const bytes=Utilities.base64Decode(text);
      const decoded=Utilities.newBlob(bytes).getDataAsString('UTF-8');
      if (Utilities.base64Encode(Utilities.newBlob(decoded).getBytes())!==text)
        throw Error('GAS_STORAGE_INVALID_UTF8');
      return decoded;
    }
  };
}
function rc11NextOwnerConfig_() {
  if (typeof PropertiesService==='undefined'||typeof Session==='undefined')
    throw Error('GAS_HOST_REQUIRED');
  const p=PropertiesService.getScriptProperties().getProperties();
  const owner=Session.getEffectiveUser().getEmail();
  if (!owner || !p.RC11_OWNER_EMAIL || owner.toLowerCase()!==p.RC11_OWNER_EMAIL.toLowerCase())
    throw Error('OWNER_IDENTITY_HOLD');
  if (!p.RC11_DATA_REPO || !p.RC11_DATA_BRANCH ||
      !p.RC11_INSTALL_ID || !p.RC11_EPOCH || !p.RC11_GITHUB_TOKEN)
    throw Error('INSTALL_CONFIGURATION_HOLD');
  return {
    repo:p.RC11_DATA_REPO,branch:p.RC11_DATA_BRANCH,
    installId:p.RC11_INSTALL_ID,epoch:p.RC11_EPOCH,
    token:p.RC11_GITHUB_TOKEN,
    requiresWriterLock:true,
    // The import-only mode writes to the new private Git ledger, never Todoist.
    // It allows snapshot migration before final production data verification,
    // avoiding an impossible migration-verified-before-migration cycle.
    importOnly:!RC11_GAS_RELEASE_APPROVED &&
      p.RC11_IMPORT_ONLY==='APPROVED_GIT_ONLY' &&
      p.RC11_WRITER_ENABLED==='APPROVED_ACTIVE_V1',
    enableWrites:(!RC11_GAS_RELEASE_APPROVED &&
      p.RC11_IMPORT_ONLY==='APPROVED_GIT_ONLY' &&
      p.RC11_WRITER_ENABLED==='APPROVED_ACTIVE_V1') ||
      (RC11_GAS_RELEASE_APPROVED && p.RC11_WRITER_ENABLED==='APPROVED_ACTIVE_V1' &&
      p.RC11_OLD_WRITER_FENCE_VERIFIED==='YES' &&
      p.RC11_DATA_MIGRATION_VERIFIED==='YES'),
    todoistProject:p.RC11_TODOIST_PROJECT_ID||'',
    todoistToken:p.RC11_TODOIST_TOKEN||'',
    todoistWrites:RC11_GAS_RELEASE_APPROVED &&
      p.RC11_TODOIST_WRITES_ENABLED==='APPROVED_ISOLATED_V1'
  };
}
function rc11NextGasStore_() {
  const config=rc11NextOwnerConfig_();
  return {config,store:rc11GitDataStore_(UrlFetchApp,config,rc11NextGasCodec_())};
}
/** A live read-only health probe. Never include tokens in its output. */
function rc11NextGasHealth() {
  try{
    const {config,store}=rc11NextGasStore_();
    const current=store.read();
    return {status:'READY_FOR_REVIEW',backend:'GITHUB_GIT_CAS',sequence:current.state.sequence,
      writerApprovalConfigured:config.enableWrites,
      activeManifestWriter:current.state.writerEnabled,
      productionActive:false, // only a separately executed cutover can assert this
      executionAuthorized:false};
  }catch{return {status:'HOLD',reason:'CONFIG_OR_STORAGE_UNVERIFIED',executionAuthorized:false};}
}
function rc11NextCurrentStudyDay_() {
  // Four-hour offset from the JST midnight boundary.
  const now=new Date(Date.now()-4*3600*1000);
  return Utilities.formatDate(now,'Asia/Tokyo','yyyy-MM-dd');
}
/** Append exact original report to GitHub (not ScriptProperties).
 * A replay HOLD is recorded as a quarantined report, not silently corrected.
 * No review rule or plan is mutated by this method.
 */
function rc11NextRecordReport(report) {
  try {
    const {config,store}=rc11NextGasStore_();
    return rc11NextWithWriterLock_(config,()=>{
    const current=store.read();
    if (!report||typeof report!=='object'||typeof report.submissionId!=='string' ||
        !/^[A-Za-z0-9_-]{1,120}$/.test(report.submissionId) ||
        typeof report.raw!=='string'||report.raw.length>25000 ||
        !report.problem || typeof report.problem!=='object')
      return {status:'HOLD',reason:'INVALID_REPORT'};
    const key=JSON.stringify([report.problem.materialId,report.problem.editionId,
      report.problem.problemKind,report.problem.problemNumber,report.problem.subquestionPath]);
    const keyHash=rc11NextGasCodec_().sha256(key);
    let old=[],historyHold=false;
    try {old=rc11NextReadHistory_(store,current).get(keyHash)||[];}
    catch {historyHold=true;}
    // Strictly distinguish reports from guesses, schedule completion and old HOLDs.
    let preview={status:'HOLD',reasons:['HISTORY_RESOLUTION_REQUIRED']};
    if(!historyHold){
      const migrated=rc11NextLegacySnapshotData_(store,current);
      const key=rc11NextLegacyProblemId_(report.problem);
      const baseline=migrated.status==='ready'&&key!==null?migrated.byId.get(key):null;
      preview=baseline?rc11NextStateFromSnapshot_(baseline,old.concat([report]),
        rc11NextCurrentStudyDay_()):RC11Next.replay(old.concat([report]),
        rc11NextCurrentStudyDay_());
    }
    const event={
      id:'report:'+report.submissionId,kind:'REPORT',
      raw:JSON.stringify(report),targetHash:keyHash,
      replayStatus:preview.status,quarantineReasons:preview.status==='HOLD'?preview.reasons:[],
      executionAuthorized:false
    };
    const saved=store.append(event,current.head);
    return {...saved,replayStatus:preview.status,
      graduated:preview.status==='ready'?preview.graduated:false,
      obligations:preview.status==='ready'?preview.obligations:[],
      executionAuthorized:false};
    });
  } catch {return {status:'HOLD',reason:'REPORT_HISTORY_OR_STORAGE_UNVERIFIED'};}
}
/** Read-only 5-minute tick candidate, never a production writer.
 * It counts due groups from the last persisted, approved, unmodified plan.
 * It may report UNKNOWN but NEVER retries a previously persisted intent.
 */
function rc11NextGasTick() {
  try {
    const {store}=rc11NextGasStore_(),snap=store.read();
    const p=PropertiesService.getScriptProperties().getProperties();
    const planHash=p.RC11_APPROVED_PLAN_HASH,source=p.RC11_APPROVED_PLAN_SOURCE;
    if(typeof planHash!=='string'||!/^[a-f0-9]{64}$/.test(planHash) ||
       typeof source!=='string'||!/^[a-f0-9]{40}$/.test(source))
      return {status:'HOLD',reason:'NO_APPROVED_PLAN',externalSends:0,
        writerActivated:false,executionAuthorized:false};
    const fence=rc11NextPlanFence_(snap,planHash,source);
    if(fence.status!=='CURRENT_PLAN_LEDGER')
      return {status:'HOLD',reason:fence.reason,externalSends:0,
        writerActivated:false,executionAuthorized:false};
    const ref=snap.state.events[fence.eventIndex];
    const event=store.readEvent(ref);
    if(event.kind!=='PLAN'||rc11NextGasCodec_().sha256(event.raw)!==planHash)
      return {status:'HOLD',reason:'APPROVED_PLAN_INTEGRITY',externalSends:0,
        writerActivated:false,executionAuthorized:false};
    const plan=JSON.parse(event.raw);
    if(plan.status!=='ready'||plan.sourceCommit!==source||
       !Array.isArray(plan.groups)||plan.groups.length>200)
      return {status:'HOLD',reason:'APPROVED_PLAN_INVALID',externalSends:0,
        writerActivated:false,executionAuthorized:false};
    const day=rc11NextCurrentStudyDay_(),epoch=rc11NextOwnerConfig_().epoch;
    const due=plan.groups.filter(g=>g&&typeof g.groupId==='string'&&
      /^\d{4}-\d{2}-\d{2}$/.test(g.scheduledDate||'')&&
      g.scheduledDate<=day);
    const intents=[],unrecorded=[],receipts=[];
    for(const g of due) {
      const key=rc11NextGasCodec_().sha256(JSON.stringify([
        epoch,planHash,g.groupId]));
      const id='todoist:'+key;
      const intent=snap.state.events.find(e=>e.id==='intent:'+id);
      if(!intent) {
        const previous=rc11NextPriorOwnership_(store,snap,g.occurrenceIds);
        if(previous.length)intents.push(g.groupId);else unrecorded.push(g.groupId);
        continue;
      }
      const receipt=snap.state.events.find(e=>e.id==='receipt:'+id);
      if(!receipt) {intents.push(g.groupId);continue;}
      const record=store.readEvent(receipt);
      const data=JSON.parse(record.raw);
      if(record.kind!=='RECEIPT'||data.planHash!==planHash||
         data.groupId!==g.groupId||!data.outcome ||
         !['ACK','UNKNOWN'].includes(data.outcome.status))
        return {status:'HOLD',reason:'RECEIPT_RECONCILIATION_HOLD',
          externalSends:0,writerActivated:false,executionAuthorized:false};
      if(data.outcome.status==='UNKNOWN')intents.push(g.groupId);
      else receipts.push(g.groupId);
    }
    return {status:'READ_ONLY',studyDay:day,
      sourceCommit:source,planHash,recordCount:snap.state.sequence,
      dueGroups:due.length,needsExplicitApproval:unrecorded,
      reconciliationRequired:intents,recordedAck:receipts,
      externalSends:0,writerActivated:false,executionAuthorized:false};
  }catch {
    return {status:'HOLD',reason:'READ_ONLY_TICK_EVIDENCE_UNVERIFIED',
      externalSends:0,writerActivated:false,executionAuthorized:false};
  }
}


/** Derive one target solely from committed immutable GitHub reports. */
function rc11NextReadReview(problem) {
  try {
    const {store}=rc11NextGasStore_(),snapshot=store.read();
    if (!problem || typeof problem!=='object')return {status:'HOLD',reason:'INVALID_TARGET'};
    const key=JSON.stringify([problem.materialId,problem.editionId,
      problem.problemKind,problem.problemNumber,problem.subquestionPath]);
    const hash=rc11NextGasCodec_().sha256(key);
    const reports=rc11NextReadHistory_(store,snapshot).get(hash)||[];
    if(!reports.length)return {status:'HOLD',reason:'NO_AUTHENTICATED_ATTEMPT'};
    const result=RC11Next.replay(reports,rc11NextCurrentStudyDay_());
    return {...result,sourceCommit:snapshot.head,
      attemptCount:reports.length,executionAuthorized:false};
  }catch{return {status:'HOLD',reason:'REVIEW_SOURCE_HOLD'};}
}
/** Read-only projection. Overrides caller-provided grades/stages with replayed
 * history. Never turns an unproven no-history claim into NEW work.
 */
function rc11NextPreviewPlanFromData(input) {
  try {
    const {store}=rc11NextGasStore_(),snapshot=store.read();
    if(!input||typeof input!=='object'||!Array.isArray(input.work)||
      input.work.length>200||input.baseGeneration!==snapshot.state.sequence)
      return {status:'HOLD',reason:'PLAN_SOURCE_GENERATION_HOLD'};
    const history=rc11NextReadHistory_(store,snapshot);
    const migrated=rc11NextLegacySnapshotData_(store,snapshot);
    const planned=JSON.parse(JSON.stringify(input));
    const migratedKeys=new Set();
    for(const w of planned.work){
      const target=JSON.stringify([w.problem.materialId,w.problem.editionId,
        w.problem.problemKind,w.problem.problemNumber,w.problem.subquestionPath]);
      const hash=rc11NextGasCodec_().sha256(target),reports=history.get(hash)||[];
      const oldId=rc11NextLegacyProblemId_(w.problem);
      if(oldId===null||migratedKeys.has(oldId)){
        w.state={status:'HOLD',reasons:['AMBIGUOUS_MATERIAL_EDITION_OR_SUBQUESTION'],
          knownObligations:[]};
        continue;
      }
      migratedKeys.add(oldId);
      if(migrated.status==='ready') {
        const old=migrated.byId.get(oldId)||null;
        const state=old
          ?rc11NextStateFromSnapshot_(old,reports,rc11NextCurrentStudyDay_())
          :reports.length
            ?(function(){
              const r=RC11Next.replay(reports,rc11NextCurrentStudyDay_());
              return r.status==='ready'?{status:'ready',graduated:r.graduated,
                attemptCount:reports.length,obligations:r.obligations}:
                {status:'HOLD',reasons:r.reasons,knownObligations:[]};
            })()
            :{status:'NEW'};
        // The legacy snapshot contains a single original ProblemID, not an
        // invented edition or child. The catalog supplies exact new references.
        if(state.status==='ready'){
          state.obligations=state.obligations.map(o=>({...o,problem:w.problem}));
        }
        w.state=state;
        continue;
      }
      if(!reports.length) {
        w.state={status:'HOLD',reasons:['NO_HISTORY_INVENTORY_REQUIRED'],
          knownObligations:[]};continue;
      }
      const derived=RC11Next.replay(reports,rc11NextCurrentStudyDay_());
      w.state=derived.status==='ready'
        ?{status:'ready',graduated:derived.graduated,attemptCount:reports.length,
          obligations:derived.obligations}
        :{status:'HOLD',reasons:derived.reasons,knownObligations:[]};
    }
    const proposed=RC11Next.simulatePlan(planned);
    return {...proposed,sourceCommit:snapshot.head,productionActive:false,executionAuthorized:false};
  }catch{return {status:'HOLD',reason:'PLANNER_SOURCE_HOLD'};}
}


/** Stage a plan only if it is based on the current Git ledger and independently
 * named by the owner's configured exact SHA256 approval token.
 * This alone never executes an external Todoist command.
 */
function rc11NextStagePlan(input) {
  try {
    const {config,store}=rc11NextGasStore_();
    return rc11NextWithWriterLock_(config,()=>{
    const candidate=rc11NextPreviewPlanFromData(input);
    if(candidate.status!=='ready'||candidate.executionAuthorized!==false)
      return {status:'HOLD',reason:'PLAN_NOT_PROVEN'};
    const snap=store.read();
    if(candidate.sourceCommit!==snap.head)return {status:'HOLD',reason:'PLAN_SOURCE_CHANGED'};
    const planBody=JSON.stringify(candidate);
    const planHash=rc11NextGasCodec_().sha256(planBody);
    const p=PropertiesService.getScriptProperties().getProperties();
    if(p.RC11_APPROVED_PLAN_HASH!==planHash ||
       p.RC11_APPROVED_PLAN_SOURCE!==snap.head)
      return {status:'HOLD',reason:'OWNER_PLAN_APPROVAL_REQUIRED',planHash,
        sourceCommit:snap.head,executionAuthorized:false};
    return {...store.append({
      id:'plan:'+planHash,kind:'PLAN',raw:planBody,executionAuthorized:false
    },snap.head),planHash,executionAuthorized:false};
    });
  }catch{return {status:'HOLD',reason:'PLAN_STAGE_UNVERIFIED'};}
}
/** Single CREATE from an already persisted owner-approved plan, for an explicitly
 * isolated Todoist test project. Never automatically retries an UNKNOWN outcome.
 */
function rc11NextCreateIsolatedTask(planHash,groupId) {
  try {
    const {config:configuration,store}=rc11NextGasStore_();
    const config={...configuration};
    if(!config.enableWrites||!config.todoistWrites||!config.todoistProject||
      config.todoistToken.length<16)return {status:'HOLD',reason:'PROVIDER_WRITER_NOT_APPROVED'};
    return rc11NextWithWriterLock_(config,()=>{
    if(typeof planHash!=='string'||!/^[a-f0-9]{64}$/.test(planHash)||
       typeof groupId!=='string'||groupId.length<1||groupId.length>4096||/[\u0000-\u001F\u007F]/.test(groupId))
      return {status:'HOLD',reason:'INVALID_PLAN_OR_GROUP'};
    const p={...PropertiesService.getScriptProperties().getProperties()};
    if(p.RC11_APPROVED_PLAN_HASH!==planHash ||
      p.RC11_ISOLATED_PROJECT_CONFIRMED!==config.todoistProject)
      return {status:'HOLD',reason:'ISOLATED_PROJECT_APPROVAL_REQUIRED'};
    const snap=store.read(),planRef=snap.state.events.find(e=>e.id==='plan:'+planHash);
    if(!planRef)return {status:'HOLD',reason:'PLAN_RECEIPT_NOT_FOUND'};
    const fence=rc11NextPlanFence_(snap,planHash,p.RC11_APPROVED_PLAN_SOURCE);
    if(fence.status!=='CURRENT_PLAN_LEDGER')
      return {status:'HOLD',reason:fence.reason,executionAuthorized:false};
    const planEntry=store.readEvent(planRef);
    if(planEntry.kind!=='PLAN'||rc11NextGasCodec_().sha256(planEntry.raw)!==planHash)
      return {status:'HOLD',reason:'PLAN_CONTENT_CHANGED'};
    const plan=JSON.parse(planEntry.raw);
    if(plan.status!=='ready'||plan.sourceCommit!==p.RC11_APPROVED_PLAN_SOURCE)
      return {status:'HOLD',reason:'PLAN_AUTHORITY_HOLD'};
    const group=plan.groups.find(g=>g.groupId===groupId);
    if(!group||!group.occurrenceIds.length||!/^\d{4}-\d{2}-\d{2}$/.test(group.scheduledDate))
      return {status:'HOLD',reason:'INVALID_PLAN_GROUP'};
    const key=rc11NextGasCodec_().sha256(JSON.stringify([config.epoch,planHash,groupId]));
    const uuid=rc11TodoistCommandId_(key);
    const identifier='todoist:'+key;
    if(snap.state.events.some(e=>e.id==='intent:'+identifier))
      return {status:'HOLD',reason:'ALREADY_INTENDED_RECONCILE_ONLY'};
    // The visible Todoist task must identify the actual approved problem set.
    // Never dispatch a group with a missing, duplicated or inconsistent member.
    if(!Array.isArray(plan.occurrences)||group.occurrenceIds.length>100||
       new Set(group.occurrenceIds).size!==group.occurrenceIds.length)
      return {status:'HOLD',reason:'GROUP_MEMBERSHIP_INVALID'};
    const selected=group.occurrenceIds.map(id=>plan.occurrences.find(o=>o.occurrenceId===id));
    if(selected.some(o=>!o||o.status!=='SCHEDULED'||
       o.scheduledDate!==group.scheduledDate||o.stage!==group.stage||
       !o.problem||typeof o.problem.materialId!=='string'||
       typeof o.problem.problemNumber!=='string'||
       !Array.isArray(o.problem.subquestionPath)))
      return {status:'HOLD',reason:'GROUP_SOURCE_OCCURRENCE_MISMATCH'};
    const prior=rc11NextPriorOwnership_(store,snap,group.occurrenceIds);
    if(prior.length)return {status:'HOLD',reason:'OCCURRENCE_ALREADY_OWNED_RECONCILE_ONLY',
      priorIntents:prior.map(x=>x.intentId),executionAuthorized:false};
    const labels=selected.map(o=>o.problem.materialId+' '+o.problem.problemNumber+
      (o.problem.subquestionPath.length?'('+o.problem.subquestionPath.join('.')+')':''));
    const title=typeof rc11NextVisibleTitle_==='function'
      ?rc11NextVisibleTitle_(plan,group,selected)
      :'RC11 '+group.stage+' | '+labels.join(' / ');
    if(title.length>500)return {status:'HOLD',reason:'GROUP_TITLE_TOO_LONG'};
    const task={content:title,description:'RC11_NEXT_ID:'+key.slice(0,32),
      dueDate:group.scheduledDate,priority:selected[0].priority};
    const intent={id:'intent:'+identifier,kind:'INTENT',
      raw:JSON.stringify({planHash,groupId,uuid,task,projectId:config.todoistProject,
        occurrenceIds:group.occurrenceIds,epoch:config.epoch}),
      executionAuthorized:false};
    const staged=store.append(intent,snap.head);
    if(staged.status!=='COMMITTED')
      return {status:staged.status==='UNKNOWN'?'UNKNOWN':'HOLD',reason:'INTENT_NOT_CONFIRMED'};
    // Authorize the send only against the state observed AFTER durable INTENT.
    // The shared native ScriptLock remains held through send and receipt storage.
    const finalSnapshot=store.read();
    const finalConfig=rc11NextGasStore_().config;
    const finalProperties=PropertiesService.getScriptProperties().getProperties();
    const finalFence=rc11NextPlanFence_(finalSnapshot,planHash,p.RC11_APPROVED_PLAN_SOURCE);
    if(finalFence.status!=='CURRENT_PLAN_LEDGER'||
       (typeof staged.head==='string'&&finalSnapshot.head!==staged.head)||
       (config.requiresWriterLock===true &&
        (typeof staged.head!=='string'||finalSnapshot.state.writerEnabled!==true))||
       ['enableWrites','todoistWrites','epoch','installId','repo','branch','token',
        'todoistToken','todoistProject','requiresWriterLock'].some(k=>finalConfig[k]!==config[k])||
       finalProperties.RC11_APPROVED_PLAN_HASH!==planHash||
       finalProperties.RC11_APPROVED_PLAN_SOURCE!==p.RC11_APPROVED_PLAN_SOURCE||
       finalProperties.RC11_ISOLATED_PROJECT_CONFIRMED!==config.todoistProject)
      return {status:'HOLD',reason:'POST_INTENT_AUTHORITY_CHANGED_RECONCILE_ONLY',executionAuthorized:false};
    const result=rc11TodoistCreateOnce_(UrlFetchApp,config.todoistToken,
      config.todoistProject,uuid,task);
    // Record receipt and UNKNOWN without inventing remote task IDs.
    const receipt=store.append({
      id:'receipt:'+identifier,kind:'RECEIPT',
      raw:JSON.stringify({outcome:result,planHash,groupId,uuid}),
      executionAuthorized:false
    });
    if(receipt.status!=='COMMITTED')return {status:'UNKNOWN',reason:'RECEIPT_PERSISTENCE_UNCERTAIN'};
    return result.status==='ACK'?
      {status:'ACK_RECORDED',remoteId:result.remoteId,executionAuthorized:false}:
      {status:'UNKNOWN',reason:result.reason||'PROVIDER_UNCONFIRMED',executionAuthorized:false};
    });
  }catch{return {status:'UNKNOWN',reason:'EXTERNAL_OPERATION_OUTCOME_UNVERIFIED'};}
}

/**
 * Existing-task UPDATE and date MOVE in the same approved Todoist project.
 * Never re-CREATE an already owned occurrence. No delete, complete or project move.
 * Uses the same GAS ScriptLock and Git CAS as the existing one-shot CREATE.
 */
function rc11NextUpdateIsolatedTask(planHash,groupId) {
  try {
    const opened=rc11NextGasStore_(),config=opened.config,store=opened.store;
    if(!config.enableWrites||!config.todoistWrites||!config.todoistProject||
       !config.todoistToken||config.todoistToken.length<16)
      return {status:'HOLD',reason:'UPDATE_WRITER_NOT_APPROVED'};
    return rc11NextWithWriterLock_(config,function(){
      if(typeof planHash!=='string'||!/^[a-f0-9]{64}$/.test(planHash)||
         typeof groupId!=='string'||groupId.length<1||groupId.length>4096)
        return {status:'HOLD',reason:'INVALID_UPDATE_GROUP'};
      const props=PropertiesService.getScriptProperties().getProperties();
      if(props.RC11_APPROVED_PLAN_HASH!==planHash||
         props.RC11_ISOLATED_PROJECT_CONFIRMED!==config.todoistProject)
        return {status:'HOLD',reason:'UPDATE_SCOPE_NOT_APPROVED'};
      const snap=store.read();
      if(rc11NextPlanFence_(snap,planHash,props.RC11_APPROVED_PLAN_SOURCE).status!=='CURRENT_PLAN_LEDGER')
        return {status:'HOLD',reason:'UPDATE_PLAN_STALE'};
      const planRef=snap.state.events.find(e=>e.id==='plan:'+planHash);
      if(!planRef)return {status:'HOLD',reason:'UPDATE_PLAN_MISSING'};
      const planEvent=store.readEvent(planRef);
      if(planEvent.kind!=='PLAN'||rc11NextGasCodec_().sha256(planEvent.raw)!==planHash)
        return {status:'HOLD',reason:'UPDATE_PLAN_INVALID'};
      const plan=JSON.parse(planEvent.raw);
      if(plan.status!=='ready'||plan.sourceCommit!==props.RC11_APPROVED_PLAN_SOURCE)
        return {status:'HOLD',reason:'UPDATE_PLAN_AUTHORITY'};
      const group=plan.groups.find(g=>g.groupId===groupId);
      if(!group||!Array.isArray(group.occurrenceIds)||!group.occurrenceIds.length||
         !/^\d{4}-\d{2}-\d{2}$/.test(group.scheduledDate||''))
        return {status:'HOLD',reason:'UPDATE_GROUP_INVALID'};
      const members=group.occurrenceIds;
      const selected=members.map(id=>plan.occurrences.find(o=>o.occurrenceId===id));
      if(selected.some(o=>!o||o.status!=='SCHEDULED'||o.scheduledDate!==group.scheduledDate||
         o.stage!==group.stage||!o.problem||
         typeof o.problem.materialId!=='string'||typeof o.problem.problemNumber!=='string'||
         !Array.isArray(o.problem.subquestionPath)))
        return {status:'HOLD',reason:'UPDATE_MEMBERSHIP_INVALID'};
      const prior=rc11NextPriorOwnership_(store,snap,members);
      if(prior.length!==1||JSON.stringify([...prior[0].occurrenceIds].sort())!==
          JSON.stringify([...members].sort()))
        return {status:'HOLD',reason:'UPDATE_REQUIRES_ONE_EXACT_BINDING'};
      const originId=prior[0].intentId;
      const originRef=snap.state.events.find(x=>x.id===originId);
      const originEvent=store.readEvent(originRef);
      if(originEvent.kind!=='INTENT')return {status:'HOLD',reason:'UPDATE_ORIGIN_INVALID'};
      const origin=JSON.parse(originEvent.raw);
      const originReceiptRef=snap.state.events.find(x=>x.id==='receipt:'+originId.slice('intent:'.length));
      if(!originReceiptRef)return {status:'HOLD',reason:'UPDATE_ORIGIN_UNCONFIRMED'};
      const originReceiptEvent=store.readEvent(originReceiptRef);
      if(originReceiptEvent.kind!=='RECEIPT')return {status:'HOLD',reason:'UPDATE_RECEIPT_INVALID'};
      const originReceipt=JSON.parse(originReceiptEvent.raw);
      if(!originReceipt.outcome||originReceipt.outcome.status!=='ACK'||
         origin.projectId!==config.todoistProject||!origin.task)
        return {status:'HOLD',reason:'UPDATE_NEEDS_CONFIRMED_ACK'};
      const remoteId=originReceipt.outcome.remoteId;
      if(typeof remoteId!=='string'||!/^[A-Za-z0-9_-]{8,80}$/.test(remoteId))
        return {status:'HOLD',reason:'UPDATE_REMOTE_ID_INVALID'};
      const updates=[];
      for(const ref of snap.state.events.filter(x=>x.id.startsWith('move-intent:'))){
        const e=store.readEvent(ref);
        if(e.kind!=='MOVE_INTENT')return {status:'HOLD',reason:'UPDATE_HISTORY_INVALID'};
        const data=JSON.parse(e.raw);
        if(data.originId!==originId)continue;
        const receiptRef=snap.state.events.find(x=>x.id==='move-receipt:'+ref.id.slice('move-intent:'.length));
        if(!receiptRef)return {status:'HOLD',reason:'UPDATE_PRIOR_OUTCOME_UNKNOWN'};
        const receipt=store.readEvent(receiptRef);
        if(receipt.kind!=='MOVE_RECEIPT')return {status:'HOLD',reason:'UPDATE_PRIOR_RECEIPT_INVALID'};
        const outcome=JSON.parse(receipt.raw).outcome;
        if(!outcome||outcome.status!=='ACK'||outcome.remoteId!==remoteId)
          return {status:'HOLD',reason:'UPDATE_PRIOR_OUTCOME_UNKNOWN'};
        updates.push(data);
      }
      const expected=updates.length?updates[updates.length-1].task:origin.task;
      const labels=selected.map(o=>o.problem.materialId+' '+o.problem.problemNumber+
        (o.problem.subquestionPath.length?'('+o.problem.subquestionPath.join('.')+')':''));
      const task={content:rc11NextVisibleTitle_(plan,group,selected),
        description:origin.task.description,dueDate:group.scheduledDate,
        priority:selected[0].priority};
      if(task.content.length>500||!/^RC11_NEXT_ID:[A-Za-z0-9_-]{8,100}$/.test(task.description))
        return {status:'HOLD',reason:'UPDATE_TASK_INVALID'};
      if(JSON.stringify(task)===JSON.stringify(expected))
        return {status:'UNCHANGED',remoteId,executionAuthorized:false};
      const observed=rc11TodoistReadOne_(UrlFetchApp,config.todoistToken,remoteId);
      if(observed.status!=='ready')return {status:'HOLD',reason:'UPDATE_REMOTE_NOT_READ'};
      const remote=observed.task;
      if(remote.project_id!==config.todoistProject||remote.content!==expected.content||
         remote.description!==expected.description||remote.due?.date!==expected.dueDate||
         remote.is_completed===true)
        return {status:'HOLD',reason:'UPDATE_REMOTE_DRIFT'};
      const kind=expected.content===task.content&&expected.priority===task.priority?'MOVE':'UPDATE';
      const key=rc11NextGasCodec_().sha256(JSON.stringify([
        config.epoch,planHash,groupId,originId,remoteId,kind,task]));
      const commandId=rc11TodoistCommandId_(key);
      const updateId='move-intent:'+key;
      if(snap.state.events.some(e=>e.id===updateId))
        return {status:'HOLD',reason:'UPDATE_ALREADY_INTENDED'};
      const intent={id:updateId,kind:'MOVE_INTENT',raw:JSON.stringify({
        planHash,groupId,originId,remoteId,kind,task,expected,commandId}),
        executionAuthorized:false};
      const staged=store.append(intent,snap.head);
      if(staged.status!=='COMMITTED')
        return {status:staged.status==='UNKNOWN'?'UNKNOWN':'HOLD',reason:'UPDATE_INTENT_UNCONFIRMED'};
      const fresh=store.read(),current=rc11NextGasStore_().config,
        live=PropertiesService.getScriptProperties().getProperties();
      if(fresh.head!==staged.head||
         rc11NextPlanFence_(fresh,planHash,props.RC11_APPROVED_PLAN_SOURCE).status!=='CURRENT_PLAN_LEDGER'||
         Object.keys(config).some(k=>current[k]!==config[k])||
         live.RC11_APPROVED_PLAN_HASH!==planHash||
         live.RC11_APPROVED_PLAN_SOURCE!==props.RC11_APPROVED_PLAN_SOURCE||
         live.RC11_ISOLATED_PROJECT_CONFIRMED!==config.todoistProject)
        return {status:'HOLD',reason:'UPDATE_POST_INTENT_CHANGED'};
      const outcome=rc11TodoistUpdateOnce_(UrlFetchApp,config.todoistToken,
        config.todoistProject,remoteId,commandId,task);
      const receipt=store.append({id:'move-receipt:'+key,kind:'MOVE_RECEIPT',
        raw:JSON.stringify({intentId:updateId,planHash,groupId,outcome}),
        executionAuthorized:false});
      if(receipt.status!=='COMMITTED')return {status:'UNKNOWN',reason:'UPDATE_RECEIPT_UNCERTAIN'};
      return outcome.status==='ACK'?{status:kind+'_ACK_RECORDED',remoteId,executionAuthorized:false}:
        {status:'UNKNOWN',reason:outcome.reason||'UPDATE_UNCONFIRMED',executionAuthorized:false};
    });
  }catch{return {status:'HOLD',reason:'UPDATE_EVIDENCE_UNVERIFIED',executionAuthorized:false};}
}

/**
 * RC11 Next GAS daily planner and five-minute Todoist synchronizer.
 * Built from the existing v0.3 replay/planner and existing Git CAS + Todoist
 * transports. This file does NOT create an alternative deployment/safety layer.
 * A single script-time trigger invokes rc11NextClockFiveMinutes, and the
 * existing RC11_GAS_RELEASE_APPROVED=false prevents writes before cutover.
 */
function rc11NextTokyoInstant_() {
  return Utilities.formatDate(new Date(),'Asia/Tokyo',"yyyy-MM-dd'T'HH:mm:ssXXX");
}
function rc11NextToday_() {
  return Utilities.formatDate(new Date(),'Asia/Tokyo','yyyy-MM-dd');
}
function rc11NextClockMinutes_() {
  return Number(Utilities.formatDate(new Date(),'Asia/Tokyo','HHmm'));
}
/** Owner-approved canonical catalog snapshot. Original catalog is never rewritten.
 * Work entries contain explicit agreed lesson scope, durations, dates and grades.
 * Every new source version produces an immutable INPUTS event. */
function rc11NextRegisterPlanningInputs(input) {
  try {
    const opened=rc11NextGasStore_(),config=opened.config,store=opened.store;
    if(!config.enableWrites)return {status:'HOLD',reason:'CATALOG_WRITER_NOT_APPROVED'};
    return rc11NextWithWriterLock_(config,function(){
      if(!input||typeof input!=='object'||!Array.isArray(input.work)||
         !Array.isArray(input.days)||!input.work.length||!input.days.length||input.work.length>5000||input.days.length>366||
         !['enabled','disabled','hold'].includes(input.newMode)||
         input.policyRevision!=='v0.3')
        return {status:'HOLD',reason:'CATALOG_INVALID'};
      const body=JSON.stringify(input);
      if(body.length>90000)return {status:'HOLD',reason:'CATALOG_TOO_LARGE'};
      const digest=rc11NextGasCodec_().sha256(body);
      const props=PropertiesService.getScriptProperties().getProperties();
      if(props.RC11_APPROVED_CATALOG_SHA256!==digest)
        return {status:'HOLD',reason:'CATALOG_OWNER_APPROVAL_REQUIRED',digest};
      const snapshot=store.read();
      const event={id:'inputs:'+digest,kind:'INPUTS',raw:body,executionAuthorized:false};
      return {...store.append(event,snapshot.head),digest,executionAuthorized:false};
    });
  }catch{return {status:'HOLD',reason:'CATALOG_STORAGE_UNVERIFIED'};}
}
/** Read-only catalog digest to support explicit input approval without writes. */
function rc11NextCatalogDigest(input) {
  if(!input||typeof input!=='object'||!Array.isArray(input.work)||
     !Array.isArray(input.days)||!input.work.length||!input.days.length)return {status:'HOLD',reason:'INVALID_CATALOG'};
  const data=JSON.stringify(input);
  if(data.length>90000)return {status:'HOLD',reason:'CATALOG_TOO_LARGE'};
  return {status:'ready',digest:rc11NextGasCodec_().sha256(data),executionAuthorized:false};
}
/** Perform the 04:05 daily reschedule using the last approved immutable catalog
 * and every report in the Git ledger. Previously planned occurrences are carried
 * forward so unreported work can be moved rather than treated as completed. */
function rc11NextAutoReplan() {
  try {
    const opened=rc11NextGasStore_(),config=opened.config,store=opened.store;
    if(!config.enableWrites)return {status:'HOLD',reason:'AUTO_PLAN_WRITER_NOT_APPROVED'};
    return rc11NextWithWriterLock_(config,function(){
      const props=PropertiesService.getScriptProperties();
      const p=props.getProperties(),today=rc11NextCurrentStudyDay_();
      if(p.RC11_AUTO_REPLAN_ENABLED!=='true')
        return {status:'HOLD',reason:'AUTO_REPLAN_DISABLED'};
      const snapshot=store.read();
      const oldPlans=snapshot.state.events.filter(x=>x.id.startsWith('plan:'));
      // A lost PropertiesService response is recoverable from the immutable PLAN.
      for(let i=oldPlans.length-1;i>=0;i--){
        const previous=store.readEvent(oldPlans[i]);
        if(previous.kind!=='PLAN')return {status:'HOLD',reason:'PLAN_RECORD_INVALID'};
        const body=JSON.parse(previous.raw);
        if(body.autoDay===today &&
           rc11NextPlanFence_(snapshot,oldPlans[i].id.slice(5),
             body.sourceCommit).status==='CURRENT_PLAN_LEDGER') {
          props.setProperties({RC11_LAST_REPLAN_DAY:today,
            RC11_APPROVED_PLAN_HASH:oldPlans[i].id.slice(5),
            RC11_APPROVED_PLAN_SOURCE:body.sourceCommit},false);
          return {status:'ALREADY_PLANNED',studyDay:today,planHash:oldPlans[i].id.slice(5)};
        }
      }
      const inputs=snapshot.state.events.filter(x=>x.id.startsWith('inputs:'));
      if(inputs.length===0)return {status:'HOLD',reason:'NO_APPROVED_WORK_CATALOG'};
      const entry=store.readEvent(inputs[inputs.length-1]);
      if(entry.kind!=='INPUTS'||rc11NextGasCodec_().sha256(entry.raw)!==entry.id.slice(7)||
         p.RC11_APPROVED_CATALOG_SHA256!==entry.id.slice(7))
        return {status:'HOLD',reason:'INPUTS_SOURCE_MISMATCH'};
      const catalog=JSON.parse(entry.raw);
      if(!catalog||catalog.policyRevision!=='v0.3'||!Array.isArray(catalog.work)||
         !Array.isArray(catalog.days))
        return {status:'HOLD',reason:'INPUTS_INVALID'};
      const previous=oldPlans.length?JSON.parse(store.readEvent(oldPlans[oldPlans.length-1]).raw):null;
      const earlier=previous?.occurrences?.filter(o=>o.status==='SCHEDULED')
        .map(o=>({occurrenceId:o.occurrenceId,scheduledDate:o.scheduledDate}))||[];
      const input={asOf:rc11NextTokyoInstant_(),baseGeneration:snapshot.state.sequence,
        policyRevision:'v0.3',newMode:catalog.newMode,
        days:catalog.days.filter(d=>d.date>=today),
        work:catalog.work,previous:earlier,
        grouping:{targetMinutes:60,implementationMaxMinutes:80}};
      if(input.days.length===0)return {status:'HOLD',reason:'NO_APPROVED_FUTURE_DAYS'};
      const planned=rc11NextPreviewPlanFromData(input);
      if(planned.status!=='ready'||!Array.isArray(planned.occurrences))
        return {status:'HOLD',reason:'UNRESOLVED_LEARNING_OR_PLAN',issues:planned.reasons||[]};
      // A few ambiguous old histories must not freeze every valid task.
      // They remain visible as HOLD occurrences in this immutable plan.
      const body=JSON.stringify({...planned,autoDay:today,
        materialDisplay:catalog.materialDisplay||{}});
      const digest=rc11NextGasCodec_().sha256(body);
      const saved=store.append({id:'plan:'+digest,kind:'PLAN',raw:body,
        executionAuthorized:false},snapshot.head);
      if(saved.status!=='COMMITTED')
        return {status:saved.status==='UNKNOWN'?'UNKNOWN':'HOLD',reason:'AUTO_PLAN_COMMIT_UNCERTAIN'};
      props.setProperties({RC11_LAST_REPLAN_DAY:today,
        RC11_APPROVED_PLAN_HASH:digest,
        RC11_APPROVED_PLAN_SOURCE:planned.sourceCommit},false);
      return {status:'PLANNED',studyDay:today,planHash:digest,
        scheduledGroups:planned.groups.length,unplaced:planned.occurrences.filter(o=>o.status==='UNPLACED').length,
        held:planned.occurrences.filter(o=>o.status==='HOLD').length,
        executionAuthorized:false};
    });
  }catch{return {status:'HOLD',reason:'AUTO_PLAN_EVIDENCE_UNVERIFIED'};}
}
/** Existing five-minute schedule: sync only due, approved, durable groups.
 * Each old ACKed group's changed due/title routes to UPDATE/MOVE instead of
 * another CREATE. UNKNOWN is left for explicit reconciliation. */
function rc11NextSyncDueGroups() {
  try {
    const opened=rc11NextGasStore_(),config=opened.config,store=opened.store;
    if(!config.enableWrites||!config.todoistWrites)return {status:'HOLD',reason:'SYNC_WRITER_NOT_APPROVED'};
    if(PropertiesService.getScriptProperties().getProperty('RC11_AUTO_TODOIST_SYNC_ENABLED')!=='true')
      return {status:'HOLD',reason:'AUTO_TODOIST_SYNC_DISABLED'};
    const p=PropertiesService.getScriptProperties().getProperties();
    const planHash=p.RC11_APPROVED_PLAN_HASH,snap=store.read();
    const fence=rc11NextPlanFence_(snap,planHash,p.RC11_APPROVED_PLAN_SOURCE);
    if(fence.status!=='CURRENT_PLAN_LEDGER')return {status:'HOLD',reason:'SYNC_PLAN_STALE'};
    const planRef=snap.state.events.find(x=>x.id==='plan:'+planHash);
    if(!planRef)return {status:'HOLD',reason:'SYNC_PLAN_MISSING'};
    const saved=store.readEvent(planRef);
    if(saved.kind!=='PLAN'||rc11NextGasCodec_().sha256(saved.raw)!==planHash)
      return {status:'HOLD',reason:'SYNC_PLAN_TAMPERED'};
    const plan=JSON.parse(saved.raw),day=rc11NextCurrentStudyDay_();
    if(!Array.isArray(plan.groups)||plan.status!=='ready')return {status:'HOLD',reason:'SYNC_PLAN_INVALID'};
    const due=plan.groups.filter(g=>g.scheduledDate>=day);
    const results=[];
    // Skip confirmed stable groups and cap only actual changes, not the first
    // three rows; otherwise later groups would starve forever.
    for(const group of due){
      const prior=rc11NextPriorOwnership_(store,store.read(),group.occurrenceIds);
      const result=prior.length?rc11NextUpdateIsolatedTask(planHash,group.groupId):
        rc11NextCreateIsolatedTask(planHash,group.groupId);
      if(result.status==='UNCHANGED')continue;
      results.push({groupId:group.groupId,status:result.status,reason:result.reason||null});
      if(!['ACK_RECORDED','UPDATE_ACK_RECORDED','MOVE_ACK_RECORDED'].includes(result.status)||results.length>=3)break;
    }
    return {status:'SYNC_ATTEMPTED',due:due.length,processed:results.length,results,
      executionAuthorized:false};
  }catch{return {status:'HOLD',reason:'SYNC_EVIDENCE_UNVERIFIED'};}
}
/** Five-minute handler also catches the first run after 04:05 if GAS trigger drifts. */
function rc11NextClockFiveMinutes() {
  const time=rc11NextClockMinutes_(),props=PropertiesService.getScriptProperties();
  // Re-evaluate freshness on each tick. A new report during the same
  // study day supersedes the previous PLAN and must be rescheduled now.
  if(time>=405){
    const p=rc11NextAutoReplan();
    if(!['PLANNED','ALREADY_PLANNED'].includes(p.status))return p;
  }
  return rc11NextSyncDueGroups();
}
/** 23:30 read-only study close; completion is never inferred from Todoist status. */
function rc11NextCloseDay2330() {
  const current=rc11NextGasTick();
  return {status:'READ_ONLY_CLOSE',studyDay:rc11NextCurrentStudyDay_(),sync:current,
    reportedCompletionsInferred:0,executionAuthorized:false};
}
/** Original GAS time-trigger model; creates NO new deployment infrastructure.
 * Invoking this requires an explicit approved cutover; no old trigger deleted. */
function rc11NextInstallFiveMinuteClock() {
  if(!RC11_GAS_RELEASE_APPROVED)return {status:'HOLD',reason:'CUTOVER_NOT_APPROVED'};
  const props=PropertiesService.getScriptProperties();
  if(props.getProperty('RC11_CLOCK_ENABLED')!=='true')
    return {status:'HOLD',reason:'CLOCK_DISABLED'};
  const existing=ScriptApp.getProjectTriggers().filter(t=>t.getHandlerFunction()==='rc11NextClockFiveMinutes');
  if(existing.length>1)return {status:'HOLD',reason:'DUPLICATE_CLOCK'};
  if(existing.length===0)
    ScriptApp.newTrigger('rc11NextClockFiveMinutes').timeBased().everyMinutes(5).create();
  return {status:'CLOCK_INSTALLED',approxMinutes:5};
}

/**
 * Lossless read-only capture of the old RC11 Sheets before any conversion.
 * Originals are NEVER modified. Import targets only the approved private
 * Git-backed journal. Review engine still requires explicit verified mapping
 * from old history event records; raw capture is not a fabricated completion.
 */
function rc11NextLegacySource_() {
  const id=PropertiesService.getScriptProperties().getProperty('RC11_LEGACY_SPREADSHEET_ID');
  if(typeof id!=='string'||!/^[A-Za-z0-9_-]{20,120}$/.test(id))
    throw Error('LEGACY_SOURCE_NOT_CONFIGURED');
  return {id,spreadsheet:SpreadsheetApp.openById(id)};
}
function rc11NextLegacyInventory() {
  try {
    const source=rc11NextLegacySource_();
    const tabs=source.spreadsheet.getSheets();
    if(tabs.length>100)return {status:'HOLD',reason:'LEGACY_TAB_LIMIT'};
    const rows=tabs.map(sh=>({name:sh.getName(),sheetId:sh.getSheetId(),
      lastRow:sh.getLastRow(),lastColumn:sh.getLastColumn()}));
    return {status:'READ_ONLY',sourceId:source.id,tabs:rows,
      imported:false,originalModified:false,executionAuthorized:false};
  }catch{return {status:'HOLD',reason:'LEGACY_INVENTORY_UNAVAILABLE'};}
}
/** Import at most 12 rows per call. Values, formulas and display strings are
 * retained together, including blank fields and row numbers. No UPDATE/DELETE. */
function rc11NextCaptureLegacyRows(tabName,startRow,limit) {
  try {
    if(typeof tabName!=='string'||!tabName.length||tabName.length>150||
       !Number.isSafeInteger(startRow)||startRow<1||
       !Number.isSafeInteger(limit)||limit<1||limit>12)
      return {status:'HOLD',reason:'INVALID_LEGACY_RANGE'};
    const opened=rc11NextGasStore_(),config=opened.config,store=opened.store;
    if(!config.enableWrites)return {status:'HOLD',reason:'LEGACY_IMPORT_WRITER_OFF'};
    return rc11NextWithWriterLock_(config,function(){
      const source=rc11NextLegacySource_();
      const sh=source.spreadsheet.getSheetByName(tabName);
      if(!sh)return {status:'HOLD',reason:'LEGACY_TAB_NOT_FOUND'};
      const total=sh.getLastRow(),width=sh.getLastColumn();
      if(startRow>total)return {status:'END_OF_TAB',nextRow:startRow};
      if(width<1||width>150)return {status:'HOLD',reason:'LEGACY_WIDTH_LIMIT'};
      const length=Math.min(limit,total-startRow+1);
      const rg=sh.getRange(startRow,1,length,width);
      const values=rg.getValues(),formulas=rg.getFormulas(),display=rg.getDisplayValues();
      const written=[];
      for(let i=0;i<length;i++){
        const row=startRow+i,payload={sourceId:source.id,tabName,
          sheetId:sh.getSheetId(),row,width,totalRowsAtCapture:total,
          values:values[i],formulas:formulas[i],display:display[i]};
        const body=JSON.stringify(payload);
        if(body.length>80000)return {status:'HOLD',reason:'LEGACY_ROW_TOO_LARGE',nextRow:row,written};
        const digest=rc11NextGasCodec_().sha256(body);
        const record={id:'migration:'+rc11NextGasCodec_().sha256(JSON.stringify([source.id,sh.getSheetId(),row])),
          kind:'MIGRATION_RECORD',raw:body,targetHash:digest,executionAuthorized:false};
        const snap=store.read(),saved=store.append(record,snap.head);
        if(!['COMMITTED','DUPLICATE'].includes(saved.status))
          return {status:saved.status==='UNKNOWN'?'UNKNOWN':'HOLD',
            reason:'LEGACY_COMMIT_UNCERTAIN',nextRow:row,written};
        written.push(row);
      }
      return {status:'CAPTURED',tabName,sourceId:source.id,rows:written,
        nextRow:startRow+length,sourceReadOnly:true,executionAuthorized:false};
    });
  }catch{return {status:'HOLD',reason:'LEGACY_CAPTURE_UNVERIFIED'};}
}
/** Read back each row by immutable hash and report missing/inconsistent source
 * before any translated history is used to schedule an occurrence. */
function rc11NextVerifyLegacyCapture(tabName,firstRow,lastRow) {
  try {
    if(typeof tabName!=='string'||!Number.isSafeInteger(firstRow)||
       !Number.isSafeInteger(lastRow)||firstRow<1||lastRow<firstRow||
       lastRow-firstRow>=100)return {status:'HOLD',reason:'LEGACY_VERIFY_RANGE_INVALID'};
    const {store}=rc11NextGasStore_(),snap=store.read(),source=rc11NextLegacySource_();
    const sh=source.spreadsheet.getSheetByName(tabName);
    if(!sh)return {status:'HOLD',reason:'LEGACY_TAB_MISSING'};
    const rows=sh.getRange(firstRow,1,lastRow-firstRow+1,sh.getLastColumn());
    const values=rows.getValues(),formulas=rows.getFormulas(),display=rows.getDisplayValues();
    for(let i=0;i<values.length;i++){
      const row=firstRow+i,id='migration:'+rc11NextGasCodec_().sha256(JSON.stringify([
        source.id,sh.getSheetId(),row]));
      const ref=snap.state.events.find(x=>x.id===id);
      if(!ref)return {status:'HOLD',reason:'MISSING_CAPTURE',row};
      const entry=store.readEvent(ref);
      if(entry.kind!=='MIGRATION_RECORD')return {status:'HOLD',reason:'INVALID_CAPTURE_KIND',row};
      const saved=JSON.parse(entry.raw);
      if(saved.sourceId!==source.id||saved.sheetId!==sh.getSheetId()||
         saved.tabName!==tabName||saved.row!==row||
         JSON.stringify(saved.values)!==JSON.stringify(values[i])||
         JSON.stringify(saved.formulas)!==JSON.stringify(formulas[i])||
         JSON.stringify(saved.display)!==JSON.stringify(display[i]))
        return {status:'HOLD',reason:'LEGACY_SOURCE_CHANGED_OR_MISMATCH',row};
    }
    return {status:'VERIFIED_CAPTURE',tabName,rows:values.length,
      originalModified:false,historyConverted:false,executionAuthorized:false};
  }catch{return {status:'HOLD',reason:'LEGACY_VERIFICATION_UNAVAILABLE'};}
}

/**
 * RC11 Next migration: use the old RC11V2_State learning snapshot,
 * never the old Todoist IDs. Existing Sheet is read-only. The immutable
 * snapshot is stored only in the existing private Git data branch.
 * This file creates no Sheet, no Todoist task and no deployment system.
 */
function rc11NextLegacyProblemId_(problem) {
  if (!problem || !/^[A-Za-z0-9_]+$/.test(problem.materialId || '') ||
      !/^\d+[A-Za-z]?$/.test(problem.problemNumber || '') ||
      !Array.isArray(problem.subquestionPath) ||
      problem.subquestionPath.some(x=>!/^[0-9]+$/.test(String(x))))
    return null;
  if(problem.subquestionPath.length>1)return null;
  return problem.materialId+':'+problem.problemNumber+
    (problem.subquestionPath.length?'('+problem.subquestionPath[0]+')':'');
}
function rc11NextParseLegacyState_(row) {
  const invalid=reason=>({status:'HOLD',reason});
  if(!Array.isArray(row)||row.length!==12||
     row.some(x=>typeof x!=='string'||x.length>1500))
    return invalid('LEGACY_ROW_SHAPE');
  const [id,stage,count,grade,done,due,graduated,resultId,material,minutes]=row;
  const m=/^([A-Za-z0-9_]+):(\d+[A-Za-z]?)(?:\((\d+)\))?$/.exec(id);
  if(!m||m[1]!==material||!['GRADUATED','UNDERSTANDING','RETENTION',
    'LONG_REVIEW','SPLIT','NEW'].includes(stage)||
     !/^(0|[1-9]\d*)$/.test(count)||Number(count)>100||
     !['○','△','×',''].includes(grade)||
     !['TRUE','FALSE'].includes(graduated)||
     !/^(0|[1-9]\d*)$/.test(minutes)||Number(minutes)>1440)
    return invalid('LEGACY_STATE_INVALID');
  const validDate=x=>/^\d{4}-\d{2}-\d{2}$/.test(x)&&
    !Number.isNaN(Date.parse(x+'T00:00:00Z'))&&
    new Date(x+'T00:00:00Z').toISOString().slice(0,10)===x;
  if((done!==''&&!validDate(done))||(due!==''&&!validDate(due)))
    return invalid('LEGACY_DATE_INVALID');
  if(stage==='GRADUATED'&&(graduated!=='TRUE'||due!==''))
    return invalid('LEGACY_GRADUATION_INCONSISTENT');
  if(stage!=='GRADUATED'&&graduated!=='FALSE')
    return invalid('LEGACY_NON_GRADUATED_INCONSISTENT');
  if(['UNDERSTANDING','RETENTION','LONG_REVIEW'].includes(stage)&&
     (Number(count)<1||!due||!done||!grade))
    return invalid('LEGACY_REVIEW_EVIDENCE_MISSING');
  // SPLIT is a composite parent; don't infer child grades from it.
  return {status:'ready',key:id,stage,attemptCount:Number(count),grade,
    lastStudyDay:done,idealReviewDate:due,graduated:graduated==='TRUE',
    sourceResultId:resultId,minutes:Number(minutes)};
}
function rc11NextLegacyBatchRows_(data) {
  if(!data||data.version!==1||data.tab!=='RC11V2_State'||
     !Number.isSafeInteger(data.firstRow)||data.firstRow<2||
     !Number.isSafeInteger(data.lastRow)||data.lastRow<data.firstRow||
     !Array.isArray(data.rows)||!data.rows.length||data.rows.length>25||
     data.lastRow!==data.firstRow+data.rows.length-1||
     data.rows.some(row=>!Array.isArray(row)||row.length!==12))throw Error('LEGACY_BATCH_INVALID');
  return data.rows;
}
function rc11NextLegacySnapshotData_(store,snapshot) {
  const sealRefs=snapshot.state.events.filter(x=>x.id.startsWith('legacy-seal:'));
  if(sealRefs.length!==1)return {status:'HOLD',reason:'LEGACY_STATE_NOT_SEALED'};
  const sealEvent=store.readEvent(sealRefs[0]);
  if(sealEvent.kind!=='LEGACY_SEAL')return {status:'HOLD',reason:'LEGACY_SEAL_KIND'};
  const seal=JSON.parse(sealEvent.raw);
  if(seal.version!==1||seal.tab!=='RC11V2_State'||
     !Array.isArray(seal.batchIds)||seal.batchIds.length>100||
     !Number.isSafeInteger(seal.lastRow)||seal.lastRow<1||
     rc11NextGasCodec_().sha256(sealEvent.raw)!==sealRefs[0].id.slice('legacy-seal:'.length))
    return {status:'HOLD',reason:'LEGACY_SEAL_INVALID'};
  const byId=new Map(),indexed=new Set(),identities=new Set();
  let nextRow=2;
  for(const id of seal.batchIds){
    const ref=snapshot.state.events.find(x=>x.id===id);
    if(!ref||indexed.has(id))return {status:'HOLD',reason:'LEGACY_BATCH_MISSING_OR_DUPLICATE'};
    indexed.add(id);
    const e=store.readEvent(ref);
    if(e.kind!=='LEGACY_STATE_BATCH')return {status:'HOLD',reason:'LEGACY_BATCH_KIND'};
    const obj=JSON.parse(e.raw);
    if(obj.sheetId!==seal.sheetId||obj.sourceId!==seal.sourceId||
       obj.firstRow!==nextRow||
       rc11NextGasCodec_().sha256(e.raw)!==id.slice('legacy-batch:'.length))
      return {status:'HOLD',reason:'LEGACY_BATCH_SOURCE_MISMATCH'};
    const rows=rc11NextLegacyBatchRows_(obj);
    for(const row of rows){
      const parsed=rc11NextParseLegacyState_(row);
      if(parsed.status!=='ready'||identities.has(parsed.key))
        return {status:'HOLD',reason:'LEGACY_DUPLICATE_OR_INVALID_STATE',
          problemId:parsed.key||null};
      identities.add(parsed.key);byId.set(parsed.key,parsed);
    }
    nextRow=obj.lastRow+1;
  }
  if(nextRow!==seal.lastRow+1)
    return {status:'HOLD',reason:'LEGACY_INCOMPLETE_SNAPSHOT'};
  return {status:'ready',byId,sourceId:seal.sourceId,sourceSheetId:seal.sheetId,
    lastRow:seal.lastRow,executionAuthorized:false};
}
/** Take up to 25 rows from the existing RC11 Fresh sheet, no modifications. */
function rc11NextImportStateBatch(firstRow,limit) {
  try {
    if(!Number.isSafeInteger(firstRow)||firstRow<2||
       !Number.isSafeInteger(limit)||limit<1||limit>25)
      return {status:'HOLD',reason:'LEGACY_RANGE_INVALID'};
    const {config,store}=rc11NextGasStore_();
    if(!config.enableWrites)return {status:'HOLD',reason:'LEGACY_WRITER_DISABLED'};
    return rc11NextWithWriterLock_(config,function(){
      const {id,spreadsheet}=rc11NextLegacySource_();
      const sh=spreadsheet.getSheetByName('RC11V2_State');
      if(!sh)return {status:'HOLD',reason:'STATE_SHEET_MISSING'};
      if(sh.getLastColumn()<12||sh.getLastRow()<2)
        return {status:'HOLD',reason:'STATE_SHEET_NOT_POPULATED'};
      const last=Math.min(sh.getLastRow(),firstRow+limit-1);
      if(last<firstRow)return {status:'END',nextRow:firstRow};
      const rows=sh.getRange(firstRow,1,last-firstRow+1,12).getDisplayValues();
      for(let i=0;i<rows.length;i++) {
        const checked=rc11NextParseLegacyState_(rows[i]);
        if(checked.status!=='ready')
          return {status:'HOLD',reason:checked.reason,row:firstRow+i};
      }
      const data={version:1,sourceId:id,tab:'RC11V2_State',
        sheetId:sh.getSheetId(),firstRow,lastRow:last,rows};
      const body=JSON.stringify(data);
      if(body.length>80000)return {status:'HOLD',reason:'STATE_BATCH_TOO_LARGE'};
      const key='legacy-batch:'+rc11NextGasCodec_().sha256(body);
      const snap=store.read();
      const result=store.append({id:key,kind:'LEGACY_STATE_BATCH',raw:body,
        executionAuthorized:false},snap.head);
      return {status:result.status,id:key,firstRow,lastRow:last,nextRow:last+1,
        totalSourceRows:sh.getLastRow(),executionAuthorized:false};
    });
  }catch{return {status:'HOLD',reason:'STATE_IMPORT_UNVERIFIED'};}
}
/** Verify exact row-for-row match between sheet and all committed batches
 * before allowing a new task catalog to regard absent old state as NEW. */
function rc11NextSealStateImport() {
  try {
    const {config,store}=rc11NextGasStore_();
    if(!config.enableWrites)return {status:'HOLD',reason:'STATE_SEAL_WRITER_OFF'};
    return rc11NextWithWriterLock_(config,function(){
      const {id,spreadsheet}=rc11NextLegacySource_();
      const sh=spreadsheet.getSheetByName('RC11V2_State');
      if(!sh||sh.getLastColumn()<12||sh.getLastRow()>1001)
        return {status:'HOLD',reason:'STATE_SOURCE_OUT_OF_RANGE'};
      const total=sh.getLastRow();
      const rows=sh.getRange(2,1,total-1,12).getDisplayValues();
      const snap=store.read(),refs=snap.state.events.filter(x=>x.id.startsWith('legacy-batch:'));
      const matched=new Map(),ids=[],seen=new Set();
      for(const ref of refs){
        const event=store.readEvent(ref);
        if(event.kind!=='LEGACY_STATE_BATCH')return {status:'HOLD',reason:'FOREIGN_STATE_BATCH'};
        const b=JSON.parse(event.raw);
        if(b.sourceId!==id||b.sheetId!==sh.getSheetId())
          continue;
        const source=b.rows;
        if(b.lastRow>total||b.firstRow<2||!Array.isArray(source))continue;
        for(let i=0;i<source.length;i++){
          const rowNo=b.firstRow+i;
          if(JSON.stringify(source[i])!==JSON.stringify(rows[rowNo-2]))continue;
          if(matched.has(rowNo)&&matched.get(rowNo)!==ref.id)
            return {status:'HOLD',reason:'AMBIGUOUS_STATE_BATCH',row:rowNo};
          matched.set(rowNo,ref.id);
        }
      }
      for(let rowNo=2;rowNo<=total;){
        const idForRow=matched.get(rowNo);
        if(!idForRow)return {status:'HOLD',reason:'MISSING_STATE_ROW',row:rowNo};
        const entry=store.readEvent(snap.state.events.find(x=>x.id===idForRow));
        const batch=JSON.parse(entry.raw);
        if(batch.firstRow!==rowNo)return {status:'HOLD',reason:'OVERLAPPING_STATE_BATCH'};
        for(let n=rowNo;n<=batch.lastRow;n++){
          if(matched.get(n)!==idForRow)return {status:'HOLD',reason:'STATE_BATCH_NOT_CONTIGUOUS'};
          const p=rc11NextParseLegacyState_(rows[n-2]);
          if(p.status!=='ready'||seen.has(p.key))
            return {status:'HOLD',reason:'INVALID_OR_DUPLICATE_STATE',row:n};
          seen.add(p.key);
        }
        ids.push(idForRow);rowNo=batch.lastRow+1;
      }
      if(snap.state.events.some(x=>x.id.startsWith('legacy-seal:')))
        return {status:'HOLD',reason:'STATE_IMPORT_ALREADY_SEALED'};
      const record={version:1,sourceId:id,tab:'RC11V2_State',
        sheetId:sh.getSheetId(),lastRow:total,batchIds:ids,
        sealedAt:new Date().toISOString()};
      const body=JSON.stringify(record);
      const key='legacy-seal:'+rc11NextGasCodec_().sha256(body);
      const written=store.append({id:key,kind:'LEGACY_SEAL',raw:body,
        executionAuthorized:false},snap.head);
      return {status:written.status,rows:seen.size,sealId:key,
        sourceSheetReadOnly:true,oldTodoistIdsImported:false};
    });
  }catch{return {status:'HOLD',reason:'LEGACY_SEAL_UNVERIFIED'};}
}
/** Reuse v0.3 semantics for subsequent reports without fabricating old attempts.
 * If an old state is split/ambiguous, leave it on HOLD with the old evidence. */
function rc11NextStateFromSnapshot_(legacy,reports,asOfDay) {
  if(!legacy)return {status:'NEW'};
  if(legacy.stage==='SPLIT')
    return {status:'HOLD',reasons:['LEGACY_SPLIT_REQUIRES_EXACT_SUBQUESTION'],
      knownObligations:[]};
  // Old-state stages are not always v0.3-compliant. Preserve questionable
  // histories without fabricating an attempt, stage or graduation.
  if((legacy.stage==='UNDERSTANDING'&&legacy.attemptCount!==1)||
     (legacy.stage==='RETENTION'&&legacy.attemptCount!==2)||
     (legacy.stage==='LONG_REVIEW'&&legacy.attemptCount<3)||
     (legacy.stage==='GRADUATED'&&legacy.attemptCount===0))
    return {status:'HOLD',reasons:['LEGACY_STAGE_ATTEMPT_AMBIGUOUS'],
      knownObligations:[]};
  if(legacy.stage==='NEW'&&legacy.attemptCount===0)
    return reports.length?{status:'HOLD',reasons:['NEW_AND_REPORT_CONFLICT'],
      knownObligations:[]}:{status:'NEW'};
  const plus=(day,n)=>{const d=new Date(day+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+n);
    return d.toISOString().slice(0,10);};
  let pending=legacy.stage==='UNDERSTANDING'?'R1':
    legacy.stage==='RETENTION'?'R2':
    legacy.stage==='LONG_REVIEW'?'R3':null;
  let next=pending?legacy.idealReviewDate:null,attempts=legacy.attemptCount,
    completed=legacy.graduated,last=legacy.lastStudyDay;
  let second=legacy.stage==='UNDERSTANDING'?plus(legacy.lastStudyDay,3):null;
  const hold=reason=>({status:'HOLD',reasons:[reason],knownObligations:[]});
  for(const r of reports) {
    if(!r||typeof r.studyDay!=='string'||!['○','△','×'].includes(r.grade)||
       r.studyDay<=last||r.studyDay>asOfDay)return hold('POST_IMPORT_REPORT_DATE');
    if(completed||!pending)return hold('POST_GRADUATION_OR_UNKNOWN_STAGE');
    // A delayed scheduled review may still be valid; the planned date is
    // an ideal date, not a requirement that the attempt occur on that day.
    if(r.studyDay<next)return hold('REVIEW_BEFORE_DUE');
    attempts++;last=r.studyDay;
    if(pending==='R1'){next=second;second=null;if(next<=last)next=plus(last,1);pending='R2';}
    else if(r.grade==='○'){pending=null;next=null;completed=true;}
    else{pending='R3';next=plus(last,3);}
  }
  if(completed)return {status:'ready',graduated:true,attemptCount:attempts,obligations:[]};
  if(!pending||!next)return hold('LEGACY_NO_NEXT_STAGE');
  const toOb=(stage,date)=>({occurrenceId:JSON.stringify(['legacy',legacy.key,stage,date]),
    problem:null,stage,idealReviewDate:date});
  const obligations=[toOb(pending,next)];
  if(second)obligations.push(toOb('R2',second));
  return {status:'ready',graduated:false,attemptCount:attempts,obligations};
}

/**
 * RC11 Sheets-backed daily store.
 * Google Sheets = learning data and journal; GitHub = source code only.
 * Existing RC11 pure review/planner functions stay unchanged.
 * All mutations of the daily snapshot are serialized by rc11DailyLock_.
 */
function rc11SheetsEnsure_(ss,name,headers) {
  let sh=ss.getSheetByName(name);
  if(!sh) sh=ss.insertSheet(name);
  if(sh.getMaxColumns()<headers.length)
    sh.insertColumnsAfter(sh.getMaxColumns(),headers.length-sh.getMaxColumns());
  if(sh.getLastRow()===0) {
    sh.getRange(1,1,1,headers.length).setValues([headers]);
    sh.setFrozenRows(1);
  } else {
    const existing=sh.getRange(1,1,1,headers.length).getDisplayValues()[0];
    if(existing.join('\u001f')!==headers.join('\u001f'))
      throw Error('SHEET_SCHEMA_MISMATCH:'+name);
  }
  return sh;
}
function rc11SheetsChunks_(value) {
  const text=typeof value==='string'?value:JSON.stringify(value);
  if(typeof text!=='string') throw Error('SHEET_PAYLOAD_INVALID');
  const out=[];for(let i=0;i<text.length;i+=12000)out.push(text.slice(i,i+12000));
  return out.length?out:[''];
}
function rc11SheetsDailyStore_(ss) {
  const runtime=rc11SheetsEnsure_(ss,'Next_Runtime',['Revision','ChunkIndex','ChunkCount','PayloadJSON']);
  const actions=rc11SheetsEnsure_(ss,'Next_ActionLog',['Revision','ChunkIndex','ChunkCount','ActionJSON','SavedAt']);
  let cached=null;
  function load() {
    const n=runtime.getLastRow();
    if(n<2) return {head:'0',body:null};
    const rows=runtime.getRange(2,1,n-1,4).getValues().filter(x=>x[0]!==''&&x[0]!==null);
    if(!rows.length)return {head:'0',body:null};
    const revision=Number(rows[0][0]),total=Number(rows[0][2]);
    if(!Number.isSafeInteger(revision)||revision<1||!Number.isSafeInteger(total)||total<1||total>500)throw Error('SHEET_SNAPSHOT_METADATA');
    if(rows.length!==total)throw Error('SHEET_SNAPSHOT_INCOMPLETE');
    const chunks=Array(total).fill(null);
    for(const row of rows) {
      const part=Number(row[1]);
      if(Number(row[0])!==revision||Number(row[2])!==total||!Number.isInteger(part)||part<0||part>=total||chunks[part]!==null)
        throw Error('SHEET_SNAPSHOT_CHUNKS');
      chunks[part]=String(row[3]??'');
    }
    if(chunks.some(x=>x===null))throw Error('SHEET_SNAPSHOT_MISSING_CHUNK');
    const body=JSON.parse(chunks.join(''));
    if(body?.state?.version!==1||body.state.revision!==revision)throw Error('SHEET_SNAPSHOT_VERSION');
    return {head:String(revision),body};
  }
  return {
    read:function(){
      cached=load();
      return {head:cached.head,state:{events:cached.body?[{id:'diagnostic:daily:current',kind:'DIAGNOSTIC'}]:[]}};
    },
    readEvent:function(ref){
      if(ref.id!=='diagnostic:daily:current'||!cached?.body)throw Error('SHEET_EVENT_NOT_FOUND');
      return {id:ref.id,kind:'DIAGNOSTIC',raw:JSON.stringify(cached.body)};
    },
    append:function(event,head){
      const current=load();
      if(current.head!==String(head))return {status:'CONFLICT',head:current.head};
      if(event?.kind!=='DIAGNOSTIC'||!event.raw)throw Error('SHEET_EVENT_INVALID');
      const body=JSON.parse(event.raw),next=body.state;
      if(next?.version!==1||next.revision!==Number(head)+1||!body.action?.type)throw Error('SHEET_STATE_INVALID');
      const revision=String(next.revision);
      const parts=rc11SheetsChunks_(JSON.stringify(body));
      const actionsJson=rc11SheetsChunks_(JSON.stringify(body.action));
      const timestamp=new Date().toISOString();
      const actionRows=actionsJson.map((part,i)=>[revision,i,actionsJson.length,part,timestamp]);
      const start=actions.getLastRow()+1;
      if(actions.getMaxRows()<start+actionRows.length-1)
        actions.insertRowsAfter(actions.getMaxRows(),start+actionRows.length-1-actions.getMaxRows());
      actions.getRange(start,1,actionRows.length,5).setValues(actionRows);
      const oldCount=Math.max(0,runtime.getLastRow()-1);
      const update=parts.map((part,i)=>[revision,i,parts.length,part]);
      while(update.length<oldCount)update.push(['','','','']);
      if(runtime.getMaxRows()<update.length+1)
        runtime.insertRowsAfter(runtime.getMaxRows(),update.length+1-runtime.getMaxRows());
      runtime.getRange(2,1,update.length,4).setValues(update);
      cached={head:revision,body};
      return {status:'COMMITTED',head:revision};
    }
  };
}
/** Enqueue a request in Sheets. A 5-minute tick consumes it once by request.id. */
function rc11SheetsEnqueue_(ss,request) {
  if(!request||typeof request.id!=='string'||!Array.isArray(request.operations))throw Error('REQUEST_INVALID');
  const sh=rc11SheetsEnsure_(ss,'Next_Reports',['RequestID','SubmittedAt','PayloadJSON','Status','ProcessedAt','Note']);
  const raw=JSON.stringify(request);
  if(raw.length>45000)throw Error('REQUEST_TOO_LARGE');
  const rows=sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,4).getValues():[];
  const duplicate=rows.find(row=>String(row[0])===request.id);
  if(duplicate){
    if(duplicate[2]!==raw)throw Error('REQUEST_ID_CONFLICT');
    return {status:'ALREADY_QUEUED',id:request.id};
  }
  sh.appendRow([request.id,new Date().toISOString(),raw,'PENDING','','']);
  return {status:'QUEUED',id:request.id};
}
function rc11SheetsInboxAck_(ss,state) {
  const sh=rc11SheetsEnsure_(ss,'Next_Reports',['RequestID','SubmittedAt','PayloadJSON','Status','ProcessedAt','Note']);
  const n=sh.getLastRow();if(n<2)return 0;
  const rows=sh.getRange(2,1,n-1,6).getValues();
  let changes=0;
  for(let i=0;i<rows.length;i++) {
    const id=String(rows[i][0]||''),entry=state.inbox?.[id];
    if(!entry||!['APPLIED','REJECTED'].includes(entry.status)||rows[i][3]===entry.status)continue;
    sh.getRange(i+2,4,1,3).setValues([[entry.status,new Date().toISOString(),entry.reason||'']]);
    changes++;
  }
  return changes;
}


/** RC11 daily operation. Sheets holds the journal, GAS runs it, Todoist displays it.
 * The historical strict preview remains available for old audit reproduction.
 * Entry points below use the owner-requested overdue/late-report semantics. */
function rc11DailyKey_(p){return JSON.stringify([p.materialId,p.editionId,p.problemKind,p.problemNumber,p.subquestionPath]);}
function rc11DailyHash_(x){return rc11NextGasCodec_().sha256(typeof x==='string'?x:JSON.stringify(x));}
function rc11DailyPlus_(day,n){const d=new Date(day+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);}
function rc11DailyProps_(){return PropertiesService.getScriptProperties();}
function rc11DailyOpen_(){
 const p=rc11DailyProps_().getProperties();
 if(p.RC11_DAILY_ENABLED!=='true')throw Error('DAILY_NOT_ENABLED');
 const owner=Session.getEffectiveUser().getEmail();
 if(p.RC11_OWNER_EMAIL&&(!owner||owner.toLowerCase()!==p.RC11_OWNER_EMAIL.toLowerCase()))
   throw Error('OWNER_MISMATCH');
 if(!p.RC11_SHEET_ID)throw Error('RC11_SHEET_ID_REQUIRED');
 const sheet=SpreadsheetApp.openById(p.RC11_SHEET_ID);
 const config={sheetId:p.RC11_SHEET_ID,todoistProject:p.RC11_TODOIST_PROJECT_ID,
  todoistToken:p.RC11_TODOIST_TOKEN};
 return {config,sheet,store:rc11SheetsDailyStore_(sheet)};
}
function rc11DailyLock_(fn){const l=LockService.getScriptLock();if(!l.tryLock(1000))return {status:'BUSY'};try{return fn();}finally{l.releaseLock();}}
function rc11DailyEmpty_(){return {version:1,revision:0,catalog:{work:[],days:[],weekly:null,newMode:'enabled',horizon:35,routines:[]},reports:[],corrections:[],bindings:[],requests:{},completedRoutines:[],pending:null,plan:null,dirty:true,lastClose:null,imported:[]};}
function rc11DailyRead_(store){const snap=store.read();for(let i=snap.state.events.length-1;i>=0;i--){const ref=snap.state.events[i];if(ref.id.startsWith('diagnostic:daily:')){const e=store.readEvent(ref),body=JSON.parse(e.raw);if(body.state?.version!==1)throw Error('DAILY_STATE_INVALID');return {state:body.state,head:snap.head};}}return {state:rc11DailyEmpty_(),head:snap.head};}
function rc11DailySave_(store,state,head,action){
 const next=JSON.parse(JSON.stringify(state));next.revision++;
 const raw=JSON.stringify({action,state:next}),r=store.append({id:'diagnostic:daily:'+rc11DailyHash_(raw),kind:'DIAGNOSTIC',raw,executionAuthorized:false},head);
 if(!['COMMITTED','DUPLICATE'].includes(r.status))throw Error('DAILY_SAVE_'+r.status);
 Object.assign(state,next);return r.head;
}
function rc11DailyReports_(s){
 const by=new Map(s.reports.map(r=>[r.submissionId,JSON.parse(JSON.stringify(r))]));
 for(const c of s.corrections){const r=by.get(c.target);if(!r){if(c.retract)continue;throw Error('CORRECTION_TARGET_RETRACTED');}if(c.retract)by.delete(c.target);else{r.grade=c.grade;if(c.studyDay)r.studyDay=c.studyDay;}}
 return rc11DailyEffectiveReports_([...by.values()]);
}
function rc11DailyEffectiveReports_(reports){
 const effective=new Map();
 for(const r of reports)effective.set(JSON.stringify([rc11DailyKey_(r.problem),r.studyDay]),r);
 return [...effective.values()].sort((a,b)=>a.studyDay.localeCompare(b.studyDay));
}
function rc11DailyDays_(catalog,today){
 const days=[];for(let i=0;i<(catalog.horizon||35);i++){
  const date=rc11DailyPlus_(today,i),explicit=catalog.days.find(d=>d.date===date);
  if(explicit){days.push(JSON.parse(JSON.stringify(explicit)));continue;}
  if(!catalog.weekly)continue;
  const weekday=new Date(date+'T00:00:00Z').getUTCDay(),w=catalog.weekly[weekday];
  if(!w)continue;
  days.push({date,classification:weekday===0||weekday===6?'rest':'weekday',totalMinutes:w.totalMinutes,
   fixed:w.fixed||[],calendarEvidenceRef:'daily-weekly',capacityExceptionRef:'daily-weekly'});
 }return days;
}
function rc11DailyWork_(w){return {problem:w.problem,policyRevision:'v0.3',approvalRef:w.approvalRef||'daily-owner',priority:w.priority??2,...(w.rank!==undefined?{rank:w.rank}:{}),minutes:w.minutes??20,firstAttemptBy:w.firstAttemptBy||null,masteryBy:w.masteryBy||null,...(w.earliestDate?{earliestDate:w.earliestDate}:{}),state:{status:'NEW'}};}
function rc11DailyPlan_(s,today,instant){
 const reports=rc11DailyReports_(s),by=new Map();
 for(const r of reports){const k=rc11DailyKey_(r.problem);by.set(k,(by.get(k)||[]).concat(r));}
 const work=[],held=[];
 for(const entry of s.catalog.work){
  if(entry.paused||entry.remainderPassed||entry.problem.subquestionPath.includes('*'))continue;
  const w=rc11DailyWork_(entry),rs=by.get(rc11DailyKey_(entry.problem))||[];
  if(rs.length||s.legacy?.states?.[rc11DailyKey_(entry.problem)]||s.legacy?.history?.[rc11DailyKey_(entry.problem)]){const r=rc11DailyReview_(s,entry.problem,rs,today);if(r.status==='HOLD'){held.push({problem:entry.problem,reasons:r.reasons});continue;}if(r.status==='NEW'){if(s.catalog.newMode!=='enabled'||entry.newPaused)continue;}else{w.state={status:'ready',graduated:r.graduated,attemptCount:r.attemptCount||rs.length||1,obligations:r.obligations};w.minutes=entry.reviewMinutes||w.minutes;}}
  else if(s.catalog.newMode!=='enabled'||entry.newPaused)continue;
  work.push(w);
 }
 const days=rc11DailyDays_(s.catalog,today);
 const spent=reports.filter(r=>r.studyDay===today).reduce((n,r)=>{const key=rc11DailyKey_(r.problem),w=s.catalog.work.find(w=>rc11DailyKey_(w.problem)===key),review=!!s.legacy?.states?.[key]?.attemptCount||!!s.legacy?.history?.[key]?.reports?.length||reports.some(x=>rc11DailyKey_(x.problem)===key&&x.studyDay<r.studyDay);return n+(review?(w?.reviewMinutes||w?.minutes||20):(w?.minutes||20));},0)+(s.routineCompletions||[]).filter(x=>x.studyDay===today).reduce((n,x)=>n+x.minutes,0);
 const d=days.find(d=>d.date===today);if(d){d.totalMinutes=Math.max(0,d.totalMinutes-spent);d.capacityExceptionRef='daily-remaining-time';}
 for(const routine of s.catalog.routines||[]){if(routine.paused)continue;const dates=new Set(days.map(d=>d.date));for(const o of s.plan?.occurrences||[]){if(o.problem.editionId==='routine'&&o.problem.problemNumber.startsWith(routine.id+'@'))dates.add(o.problem.problemNumber.slice((routine.id+'@').length));}for(const date of [...dates].sort()){const day={date};
  const wd=new Date(day.date+'T00:00:00Z').getUTCDay();if(routine.weekdays&&!routine.weekdays.includes(wd))continue;
  if(routine.from&&day.date<routine.from||routine.through&&day.date>routine.through)continue;
  const id=routine.id+'@'+day.date;if(s.completedRoutines.includes(id))continue;
  work.push(rc11DailyWork_({problem:{materialId:routine.title,editionId:'routine',problemKind:'routine',problemNumber:id,subquestionPath:[]},minutes:routine.minutes,priority:routine.priority||2,earliestDate:day.date,firstAttemptBy:day.date}));
 }}
 if(work.length>5000)throw Error('TOO_MANY_ACTIVE_WORK_ITEMS');
 const previous=s.plan?.occurrences?.filter(o=>o.status==='SCHEDULED').map(o=>({occurrenceId:o.occurrenceId,scheduledDate:o.scheduledDate}))||[];
 const plan=RC11Next.simulateDailyPlan({asOf:instant,baseGeneration:s.revision,policyRevision:'v0.3',newMode:'enabled',days,work,previous,grouping:{targetMinutes:60,implementationMaxMinutes:80}});
 if(plan.status!=='ready')throw Error('DAILY_PLAN_'+plan.reasons.join(','));
 // Domain revision is a full canonical value; store its digest, not a duplicate plan.
 plan.revisionId=rc11DailyHash_(plan.revisionId);plan.studyDay=today;plan.held=held;plan.spentMinutes=spent;plan.materialDisplay=s.catalog.materialDisplay||{};
 for(const g of plan.groups)g.groupId=rc11DailyHash_(g.groupId);
 return plan;
}
function rc11DailyApply_(state,request,today){
 if(!request||typeof request.id!=='string'||!request.id.length||request.id.length>160||!Array.isArray(request.operations)||!request.operations.length)throw Error('REQUEST_INVALID');
 const digest=rc11DailyHash_(request);if(state.requests[request.id]){if(state.requests[request.id]!==digest)throw Error('REQUEST_ID_CONFLICT');return false;}
 const s=state;
 for(const op of request.operations){
  if(op.type==='ADD_WORK'||op.type==='PATCH_WORK'){
   const w=op.work;if(!w?.problem)throw Error('WORK_REQUIRED');const key=rc11DailyKey_(w.problem),n=s.catalog.work.findIndex(x=>rc11DailyKey_(x.problem)===key);
   if(n<0){if(op.type==='PATCH_WORK')throw Error('WORK_NOT_FOUND');s.catalog.work.push({...rc11DailyWork_(w),...w});}
   else s.catalog.work[n]={...s.catalog.work[n],...w};
  }else if(op.type==='REPORT'){
   for(const input of op.reports||[op.report]){
    if(!input?.problem)throw Error('REPORT_REQUIRED');
    const r={...input,grade:input.grade==='◯'?'○':input.grade,reportedDay:input.reportedDay||today,policyRevision:'v0.3',raw:input.raw||input.grade,source:input.source||'daily-owner'};
    if(!r.submissionId||!r.attemptId)throw Error('REPORT_IDS_REQUIRED');
    const old=s.reports.find(x=>x.submissionId===r.submissionId);if(old){if(JSON.stringify(old)!==JSON.stringify(r))throw Error('REPORT_ID_CONFLICT');continue;}
    const key=rc11DailyKey_(r.problem);let w=s.catalog.work.find(x=>rc11DailyKey_(x.problem)===key);
    if(!w&&r.problem.subquestionPath.length){const parent=s.catalog.work.find(x=>x.problem.materialId===r.problem.materialId&&x.problem.editionId===r.problem.editionId&&x.problem.problemKind===r.problem.problemKind&&x.problem.problemNumber===r.problem.problemNumber&&!x.problem.subquestionPath.length);if(parent){w={...parent,problem:r.problem,remainderPassed:false};s.catalog.work.push(w);if(op.remainderPassed===true)parent.remainderPassed=true;}}
    if(!w)throw Error('REPORT_WORK_NOT_REGISTERED');
    const trial=rc11DailyReports_(s).filter(x=>rc11DailyKey_(x.problem)===key).concat(r),checked=rc11DailyReview_(s,r.problem,trial,today);
    if(checked.status!=='ready')throw Error('REPORT_'+checked.reasons.join(','));s.reports.push(r);
   }
  }else if(op.type==='CORRECT_REPORT'||op.type==='RETRACT_REPORT'){
   if(!s.reports.some(r=>r.submissionId===op.target))throw Error('REPORT_NOT_FOUND');
   if(op.type==='CORRECT_REPORT'&&!['○','△','×'].includes(op.grade))throw Error('INVALID_GRADE');
   s.corrections.push({id:request.id+':'+s.corrections.length,target:op.target,grade:op.grade,retract:op.type==='RETRACT_REPORT',...(op.studyDay?{studyDay:op.studyDay}:{})});
  }else if(op.type==='SET_CAPACITY'){
   const day=op.day;if(!day?.date)throw Error('DAY_REQUIRED');const n=s.catalog.days.findIndex(x=>x.date===day.date);if(n<0)s.catalog.days.push(day);else s.catalog.days[n]=day;
  }else if(op.type==='SET_WEEKLY'){s.catalog.weekly=op.weekly;
  }else if(op.type==='SET_NEW_MODE'){if(!['enabled','disabled'].includes(op.mode))throw Error('INVALID_NEW_MODE');s.catalog.newMode=op.mode;
  }else if(op.type==='PAUSE_WORK'||op.type==='RESUME_WORK'){
   const w=s.catalog.work.find(x=>rc11DailyKey_(x.problem)===rc11DailyKey_(op.problem));if(!w)throw Error('WORK_NOT_FOUND');w.paused=op.type==='PAUSE_WORK';
  }else if(op.type==='ADD_ROUTINE'){
   if(!op.routine?.id||!op.routine.title||!Number.isInteger(op.routine.minutes)||op.routine.minutes<1)throw Error('ROUTINE_INVALID');
   const routine={from:today,...op.routine};const n=s.catalog.routines.findIndex(x=>x.id===routine.id);if(n<0)s.catalog.routines.push(routine);else s.catalog.routines[n]={...s.catalog.routines[n],...op.routine};
  }else if(op.type==='COMPLETE_ROUTINE'){if(typeof op.id!=='string')throw Error('ROUTINE_ID_REQUIRED');const routine=s.catalog.routines.find(r=>op.id.startsWith(r.id+'@')),day=op.id.slice(op.id.lastIndexOf('@')+1);if(!routine||!/^\d{4}-\d{2}-\d{2}$/.test(day)||day>today)throw Error('ROUTINE_NOT_DUE');if(!s.completedRoutines.includes(op.id)){s.completedRoutines.push(op.id);(s.routineCompletions=s.routineCompletions||[]).push({id:op.id,studyDay:today,minutes:routine.minutes});}
  }else throw Error('UNKNOWN_OPERATION:'+op.type);
 }
 if(s.catalog.work.length>5000)throw Error('TOO_MANY_WORK_ITEMS');
 s.requests[request.id]=digest;s.dirty=true;return true;
}
function rc11DailySubmit(request){return rc11DailyLock_(function(){
 const {store}=rc11DailyOpen_(),loaded=rc11DailyRead_(store),s=loaded.state;
 if(!rc11DailyApply_(s,request,rc11NextCurrentStudyDay_()))return {status:'ALREADY_APPLIED',id:request.id};
 // Validate the entire batch before committing any of it.
 s.plan=rc11DailyPlan_(s,rc11NextCurrentStudyDay_(),rc11NextTokyoInstant_());s.dirty=false;
 rc11DailySave_(store,s,loaded.head,{type:'REQUEST',request});
 return {status:'APPLIED',id:request.id,groups:s.plan.groups.length,held:s.plan.held,unplaced:s.plan.occurrences.filter(o=>o.status==='UNPLACED').length};
});}
function rc11DailyTask_(plan,group){
 const os=group.occurrenceIds.map(id=>plan.occurrences.find(o=>o.occurrenceId===id));if(os.some(o=>!o))throw Error('GROUP_MEMBER_MISSING');
 return {content:rc11NextVisibleTitle_(plan,group,os),
  due:group.scheduledDate,priority:Math.max(...os.map(o=>o.priority)),minutes:group.minutes,
  details:os.map(o=>o.problem.materialId+' '+o.problem.problemNumber+(o.problem.subquestionPath.length?'('+o.problem.subquestionPath.join('.')+')':'')).join('\n')};
}
/** Match stable occurrence sets by overlap; update one surviving task and close surplus displays.
 * Closing a superseded display never changes a learning grade. */
function rc11DailyDiff_(s){
 const groups=s.plan.groups,old=s.bindings.filter(b=>!b.closed),used=new Set(),ops=[];
 for(const g of groups){
  const candidates=old.filter(b=>!used.has(b.id)).map(b=>({b,n:g.occurrenceIds.filter(id=>b.members.includes(id)).length})).filter(x=>x.n>0).sort((a,b)=>b.n-a.n||a.b.id.localeCompare(b.b.id));
  const binding=candidates[0]?.b,task=rc11DailyTask_(s.plan,g);
  if(binding){used.add(binding.id);if(JSON.stringify(task)!==JSON.stringify(binding.task)||JSON.stringify(g.occurrenceIds)!==JSON.stringify(binding.members))ops.push({kind:'UPDATE',bindingId:binding.id,remoteId:binding.remoteId,members:g.occurrenceIds,task});}
  else ops.push({kind:'CREATE',bindingId:rc11DailyHash_([g.occurrenceIds,s.revision]),members:g.occurrenceIds,task});
 }
 // Preserve unplaced/paused work visibly, without leaving its old overdue date.
 const outstanding=new Set(s.plan.occurrences.filter(o=>o.status!=='SCHEDULED').map(o=>o.occurrenceId));
 for(const b of old.filter(b=>!used.has(b.id))){
  if(b.members.some(id=>outstanding.has(id))){const task={...b.task,due:null,content:'未配置｜'+b.task.content.replace(/^未配置｜/, '')};if(JSON.stringify(task)!==JSON.stringify(b.task))ops.push({kind:'UPDATE',bindingId:b.id,remoteId:b.remoteId,members:b.members,task});}
  else ops.push({kind:'CLOSE',bindingId:b.id,remoteId:b.remoteId,members:b.members});
 }
 return ops;
}
function rc11DailyCommand_(config,op){return rc11DailyTodoistSend_(UrlFetchApp,config,op);}
function rc11DailyApplyAck_(s,op,remoteId){
 const n=s.bindings.findIndex(b=>b.id===op.bindingId),b={id:op.bindingId,remoteId,members:op.members,task:op.task||s.bindings[n]?.task,closed:op.kind==='CLOSE'};
 if(n<0)s.bindings.push(b);else s.bindings[n]=b;s.pending=null;
}
function rc11DailySync_(opened,s,head){
 const {store,config}=opened;if(!config.todoistToken||!config.todoistProject)return {head,status:'TODOIST_NOT_CONFIGURED',processed:0};
 let count=0;const started=Date.now();
 while(count<20&&Date.now()-started<180000){
  let op=s.pending;
  if(!op){op=rc11DailyDiff_(s)[0];if(!op)return {head,status:'SYNCED',processed:count};
   op.uuid=rc11TodoistCommandId_(rc11DailyHash_([s.revision,op]));s.pending=op;head=rc11DailySave_(store,s,head,{type:'SYNC_INTENT',op});}
  // Reuse the stored Sync API UUID after an interrupted request, never invent a new CREATE.
  let remoteId;try{remoteId=rc11DailyCommand_(config,op);}catch(e){return {head,status:'SYNC_PENDING',processed:count,reason:String(e.message||e)};}
  rc11DailyApplyAck_(s,op,remoteId);head=rc11DailySave_(store,s,head,{type:'SYNC_ACK',uuid:op.uuid,remoteId});count++;
 }
 return {head,status:'SYNC_PARTIAL',processed:count};
}
function rc11DailySummary_(s,today){
 const rs=rc11DailyReports_(s),counts={'○':0,'△':0,'×':0};rs.filter(r=>r.studyDay===today).forEach(r=>counts[r.grade]++);
 return {studyDay:today,reportedAttempts:Object.values(counts).reduce((a,b)=>a+b,0),grades:counts,
  spentMinutes:s.plan?.spentMinutes||0,
  scheduledMinutes:s.plan?.days.find(d=>d.date===today)?.usedMinutes||0,
  remainingGroups:s.plan?.groups.filter(g=>g.scheduledDate===today).length||0,
  unplaced:s.plan?.occurrences.filter(o=>o.status==='UNPLACED').length||0,
  held:s.plan?.held||[],inboxErrors:Object.values(s.inbox||{}).filter(x=>x.status==='REJECTED'),deadlineRisks:s.plan?.risks.filter(r=>/DEADLINE/.test(r.code))||[],
  projectedLastScheduledDate:s.plan?.groups.map(g=>g.scheduledDate).sort().pop()||null,
  forecastAssumption:'現在の課題と確定済み復習のみ。将来の△×による追加復習は含まない。'};
}
function rc11DailyRun(){return rc11DailyLock_(function(){
 const opened=rc11DailyOpen_(),loaded=rc11DailyRead_(opened.store),s=loaded.state,today=rc11NextCurrentStudyDay_();let head=loaded.head;
 // Finish a persisted provider request before changing its plan context.
 if(s.pending){const sync=rc11DailySync_(opened,s,head);head=sync.head;if(s.pending)return {...sync,summary:rc11DailySummary_(s,today)};}
 if(rc11DailyRepairHistoryNeeded_(s)){
  const repaired=rc11DailyRepairHistoryState_(s,rc11DailyReadLegacy_().tables,today);
  head=rc11DailySave_(opened.store,s,head,{type:'HISTORY_RECONCILIATION',...repaired});
 }
 if(rc11DailyInbox_(opened,s))head=rc11DailySave_(opened.store,s,head,{type:'INBOX'});
  rc11DailyAck_(opened,s);
 if(s.dirty||s.plan?.studyDay!==today){s.plan=rc11DailyPlan_(s,today,rc11NextTokyoInstant_());s.dirty=false;head=rc11DailySave_(opened.store,s,head,{type:'REPLAN',today});}
 const sync=rc11DailySync_(opened,s,head);head=sync.head;
 if(rc11NextClockMinutes_()>=2330&&s.lastClose?.studyDay!==today){s.lastClose=rc11DailySummary_(s,today);head=rc11DailySave_(opened.store,s,head,{type:'DAY_CLOSE',today});}
 return {status:sync.status,processed:sync.processed,reason:sync.reason||null,summary:rc11DailySummary_(s,today)};
});}
function rc11DailyLogSummary_(r){
 const summary=r.summary||{};
 return {status:r.status,processed:r.processed||0,reason:r.reason||null,
  studyDay:summary.studyDay||null,reportedAttempts:summary.reportedAttempts||0,
  remainingGroups:summary.remainingGroups||0,unplaced:summary.unplaced||0,
  heldCount:summary.held?.length||0,inboxErrorCount:summary.inboxErrors?.length||0,
  deadlineRiskCount:summary.deadlineRisks?.length||0};
}
function rc11DailyClock(){try{const time=rc11NextClockMinutes_();if(time>=400&&time<405)return {status:'WAITING_FOR_0405'};const r=rc11DailyRun();console.log(JSON.stringify(rc11DailyLogSummary_(r)));return r;}catch(e){console.error('RC11_DAILY_ERROR '+String(e.message||e));return {status:'ERROR',reason:String(e.message||e)};}}
function rc11DailyStatus(){const {store}=rc11DailyOpen_(),s=rc11DailyRead_(store).state;return {revision:s.revision,work:s.catalog.work.length,reports:s.reports.length,pending:!!s.pending,lastClose:s.lastClose,summary:rc11DailySummary_(s,rc11NextCurrentStudyDay_())};}
function rc11DailyInstallClock(){rc11DailyOpen_();const ts=ScriptApp.getProjectTriggers().filter(t=>t.getHandlerFunction()==='rc11DailyClock');if(ts.length>1)throw Error('DUPLICATE_CLOCK');if(!ts.length)ScriptApp.newTrigger('rc11DailyClock').timeBased().everyMinutes(5).create();return {status:'INSTALLED',handler:'rc11DailyClock'};}
/** Sheets inbox: process requests only from the owner-controlled workbook. */
function rc11DailyInbox_(opened,s){
 const sh=rc11SheetsEnsure_(opened.sheet,'Next_Reports',
  ['RequestID','SubmittedAt','PayloadJSON','Status','ProcessedAt','Note']);
 const n=sh.getLastRow();if(n<2)return false;
 const rows=sh.getRange(2,1,n-1,6).getValues();
 s.inbox=s.inbox||{};let changed=false,processed=0;
 for(const row of rows){
  if(processed>=50)break;
  const id=String(row[0]||''),status=String(row[3]||'');
  if(!id||status==='APPLIED'||status==='REJECTED')continue;
  if(status&&status!=='PENDING')continue;
  if(s.inbox[id]&&['APPLIED','REJECTED'].includes(s.inbox[id].status))continue;
  const candidate=JSON.parse(JSON.stringify(s));
  try {
   const request=JSON.parse(String(row[2]||''));
   if(request.id!==id)throw Error('REQUEST_ID_MISMATCH');
   rc11DailyApply_(candidate,request,rc11NextCurrentStudyDay_());
   rc11DailyPlan_(candidate,rc11NextCurrentStudyDay_(),rc11NextTokyoInstant_());
   Object.assign(s,candidate);
   s.inbox[id]={status:'APPLIED'};
  } catch(e) {
   s.inbox[id]={status:'REJECTED',reason:String(e.message||e)};
  }
  changed=true;processed++;
 }
 return changed;
}
function rc11DailyAck_(opened,s){return rc11SheetsInboxAck_(opened.sheet,s);}

/** Call once after setting the existing GitHub/Todoist properties. Creates only
 * the private Git data branch/state if absent; does not create tasks or triggers. */
/** Prepare only the current Sheets workbook. No tasks, code or triggers deployed. */
function rc11DailySetup(){return rc11DailyLock_(function(){
 const props=rc11DailyProps_(),p=props.getProperties();
 if(!p.RC11_SHEET_ID)throw Error('SET_RC11_SHEET_ID');
 const owner=Session.getEffectiveUser().getEmail();
 if(!owner)throw Error('OWNER_EMAIL_UNAVAILABLE');
 if(p.RC11_OWNER_EMAIL&&p.RC11_OWNER_EMAIL.toLowerCase()!==owner.toLowerCase())throw Error('OWNER_MISMATCH');
 const ss=SpreadsheetApp.openById(p.RC11_SHEET_ID);
 rc11SheetsDailyStore_(ss).read();
 rc11SheetsEnsure_(ss,'Next_Reports',['RequestID','SubmittedAt','PayloadJSON','Status','ProcessedAt','Note']);
 props.setProperty('RC11_OWNER_EMAIL',owner);
 props.setProperty('RC11_LEGACY_SPREADSHEET_ID',p.RC11_LEGACY_SPREADSHEET_ID||p.RC11_SHEET_ID);
 props.setProperty('RC11_DAILY_ENABLED','true');
 return {status:'READY',sheetId:p.RC11_SHEET_ID,next:'rc11DailyPreviewImport, then rc11DailyImportLegacy',todoistTasksCreated:0,triggersInstalled:0};
});}


/**
 * Step 4 Todoist transport for the daily Sheets-backed GAS runtime.
 * Sheets owns the learning state. Todoist is a display of scheduled groups.
 * No outgoing request occurs unless rc11DailySync_ invokes this explicitly.
 */
function rc11DailyTodoistPayload_(config,op){
 if(!op||!['CREATE','UPDATE','CLOSE'].includes(op.kind))throw Error('TODOIST_OPERATION_INVALID');
 if(!/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(String(op.uuid||'')))
   throw Error('TODOIST_UUID_INVALID');
 if(!/^[A-Za-z0-9_-]{8,80}$/.test(String(config?.todoistProject||'')))throw Error('TODOIST_PROJECT_INVALID');
 if(!op.bindingId||typeof op.bindingId!=='string')throw Error('TODOIST_BINDING_MISSING');
 if(op.kind==='CLOSE'){
  if(!/^[A-Za-z0-9_-]{8,80}$/.test(String(op.remoteId||'')))throw Error('TODOIST_REMOTE_ID_INVALID');
  return {type:'item_close',uuid:op.uuid,args:{id:op.remoteId}};
 }
 const t=op.task||{};
 if(typeof t.content!=='string'||!t.content.length||t.content.length>500||
    !Number.isInteger(t.priority)||t.priority<1||t.priority>4)
   throw Error('TODOIST_TASK_INVALID');
 if(t.due!==null&&t.due!==undefined&&!/^\d{4}-\d{2}-\d{2}$/.test(String(t.due)))
   throw Error('TODOIST_DUE_INVALID');
 const description='RC11_DAILY:'+op.bindingId+'\n目安：'+(t.minutes||0)+'分\n'+(t.details||'')+
   '\n○△×の報告が学習履歴の正本です。Todoistの完了操作だけでは卒業しません。';
 const args={
  ...(op.kind==='CREATE'?{project_id:config.todoistProject}:{id:op.remoteId}),
  content:t.content,description,priority:t.priority,
  ...(t.due?{due:{date:t.due}}:op.kind==='UPDATE'?{due:null}:{})
 };
 if(op.kind==='UPDATE'&&!/^[A-Za-z0-9_-]{8,80}$/.test(String(op.remoteId||'')))
   throw Error('TODOIST_REMOTE_ID_INVALID');
 return {type:op.kind==='CREATE'?'item_add':'item_update',uuid:op.uuid,
  ...(op.kind==='CREATE'?{temp_id:op.uuid}:{}),args};
}
function rc11DailyTodoistSend_(fetcher,config,op){
 if(!config?.todoistToken||typeof config.todoistToken!=='string')throw Error('TODOIST_TOKEN_MISSING');
 const cmd=rc11DailyTodoistPayload_(config,op);
 const response=fetcher.fetch('https://api.todoist.com/api/v1/sync',{
  method:'post',contentType:'application/x-www-form-urlencoded',
  headers:{Authorization:'Bearer '+config.todoistToken,Accept:'application/json'},
  payload:'commands='+encodeURIComponent(JSON.stringify([cmd])),
  muteHttpExceptions:true
 });
 if(response.getResponseCode()!==200)throw Error('TODOIST_HTTP_'+response.getResponseCode());
 const data=JSON.parse(response.getContentText()),result=data?.sync_status?.[cmd.uuid];
 if(result!=='ok')throw Error('TODOIST_COMMAND_'+JSON.stringify(result||'MISSING'));
 const id=op.kind==='CREATE'?data.temp_id_mapping?.[cmd.uuid]:op.remoteId;
 if(typeof id!=='string'||!id.length)throw Error('TODOIST_REMOTE_ID_MISSING');
 return id;
}
/** Preview pending actions without sending requests or creating tasks. */
function rc11DailyTodoistPreview(){
 const opened=rc11DailyOpen_(),s=rc11DailyRead_(opened.store).state;
 if(!s.plan)return {status:'NO_PLAN',actions:0};
 const pending=s.pending?[s.pending]:rc11DailyDiff_(s);
 const counts={CREATE:0,UPDATE:0,CLOSE:0};
 for(const op of pending)counts[op.kind]=(counts[op.kind]||0)+1;
 return {status:'PREVIEW',projectId:opened.config.todoistProject||null,
  configured:!!opened.config.todoistProject&&!!opened.config.todoistToken,
  planRevision:s.plan.revisionId,actions:pending.length,counts,
  taskTitles:pending.slice(0,10).map(op=>({kind:op.kind,content:op.task?.content||''})),
  externalSends:0};
}

/** Read-only check of the configured Todoist token and intended project.
 * Does not create, update, complete, or delete any Todoist task.
 * Never print or return the API token.
 */
function rc11DailyTodoistConnectionCheck(){
 const {config}=rc11DailyOpen_();
 if(!config.todoistProject||!config.todoistToken){
  const missing={status:'NOT_CONFIGURED',projectConfigured:!!config.todoistProject,tokenConfigured:!!config.todoistToken};
  console.log('RC11_TODOIST_CHECK '+JSON.stringify(missing));
  return missing;
 }
 const response=UrlFetchApp.fetch('https://api.todoist.com/api/v1/projects/'+encodeURIComponent(config.todoistProject),{
  method:'get',
  headers:{Authorization:'Bearer '+config.todoistToken,Accept:'application/json'},
  muteHttpExceptions:true
 });
 const status=response.getResponseCode();
 if(status!==200){
  const result={status:'CONNECTION_FAILED',httpStatus:status};
  console.log('RC11_TODOIST_CHECK '+JSON.stringify(result));
  return result;
 }
 const project=JSON.parse(response.getContentText());
 const result=String(project.id)===String(config.todoistProject)
  ?{status:'CONNECTED',httpStatus:status,projectId:String(project.id),projectName:String(project.name||'')}
  :{status:'WRONG_PROJECT',httpStatus:status};
 console.log('RC11_TODOIST_CHECK '+JSON.stringify(result));
 return result;
}


/**
 * Step 3: rebuild review state from migrated grading evidence.
 * Google Sheets EventLog and RC11V2_Results remain untouched.
 * No assumption is made about missing dates, composite parents or silent redos.
 */
function rc11HistoryDate_(s){
 const d=String(s||'').slice(0,10);
 if(!/^\d{4}-\d{2}-\d{2}$/.test(d))return null;
 const t=new Date(d+'T00:00:00Z');
 return Number.isFinite(t.getTime())&&t.toISOString().slice(0,10)===d?d:null;
}
function rc11HistoryGrade_(g){return g==='◯'?'○':g;}
function rc11HistoryBuild_(tables,today){
 const all=[],ids=new Set(),excluded=new Set(),missingCorrections=[],issueById={};
 const issue=(key,reason)=>{
  if(!issueById[key])issueById[key]=[];
  if(!issueById[key].includes(reason))issueById[key].push(reason);
 };
 const rawEvents=tables.EventLog||[],rawResults=tables.RC11V2_Results||[];
 const rawReportItems=tables.Reports||[],reportTimes=new Map();
 for(const row of rawReportItems){
  const time=Date.parse(row.SentAt||'');
  if(Number.isFinite(time))reportTimes.set(String(row.SourceReportID),time);
 }
 const reportOrder=new Map();
 function append(kind,row,index){
  const id=String(kind==='EventLog'?row.EventID:row.ResultID||'').trim();
  const problemId=String(kind==='EventLog'?row.ProblemID:row.ProblemID||'').trim();
  if(!id||ids.has(id))throw Error('DUPLICATE_OR_EMPTY_HISTORY_ID:'+kind+':'+index);
  ids.add(id);
  if(!problemId)throw Error('HISTORY_PROBLEM_ID_MISSING:'+kind+':'+index);
  // A whole-attempt marker isn't a grade. Never turn UNKNOWN into ○.
  if(kind==='EventLog'&&row.Kind==='WHOLE_ATTEMPT_SCOPE')return {kind,id,problemId,scopeOnly:true};
  if(kind==='RC11V2_Results'&&row.Status!=='APPLIED')return {kind,id,problemId,skipped:true};
  const grade=rc11HistoryGrade_(kind==='EventLog'?row.Result:row.Grade);
  const date=rc11HistoryDate_(kind==='EventLog'?(row.ReportedStudyDate||row.PerformedAt):row.StudyDate);
  const recorded=rc11HistoryDate_(kind==='EventLog'?row.RecordedAt:row.RecordedAt);
  const corrects=String((kind==='EventLog'?row.CorrectsEventID:row.CorrectsResultID)||'').trim();
  const sourceTime=kind==='EventLog'?reportTimes.get(String(row.SourceReportID)):undefined;
  const recordedTime=Date.parse(row.RecordedAt||'');
  reportOrder.set(id,{time:sourceTime??(Number.isFinite(recordedTime)?recordedTime:0),index});
  return {kind,id,problemId,grade,date,recorded,corrects,
    basis:String(kind==='EventLog'?row.Basis:row.Source||''),sourceOrder:index};
 }
 for(let i=0;i<rawEvents.length;i++)all.push(append('EventLog',rawEvents[i],i+2));
 for(let i=0;i<rawResults.length;i++)all.push(append('RC11V2_Results',rawResults[i],i+2));
 const byId=new Map(all.map(e=>[e.id,e]));
 for(const e of all){
  if(!e.corrects)continue;
  if(!byId.has(e.corrects)) {
   missingCorrections.push(e.id);
   issue(e.problemId,'CORRECTION_TARGET_NOT_FOUND');
  } else excluded.add(e.corrects);
 }
 const byKey={},metadata={sourceRows:all.length,eventRows:rawEvents.length,resultRows:rawResults.length,
  corrected:excluded.size,explicitGraduations:0,scopeMarkers:0,skippedResults:0,undated:0,heldProblems:0,
  replayableProblems:0,issues:0,collapsedSameDay:0};
 for(const e of all){
  let problem;
  try{problem=rc11DailyLegacyProblem_(e.problemId);}catch{
   issue(e.problemId,'INVALID_PROBLEM_ID');continue;
  }
  const key=rc11DailyKey_(problem);
  if(!byKey[key])byKey[key]={problem,sourceIds:[],reports:[],issues:[],latestStudyDay:null};
  const bucket=byKey[key];bucket.sourceIds.push(e.id);
  if(e.scopeOnly){metadata.scopeMarkers++;continue;}
  if(e.skipped){metadata.skippedResults++;continue;}
  if(excluded.has(e.id))continue;
  if(e.corrects&&!byId.has(e.corrects)){issue(e.problemId,'CORRECTION_TARGET_NOT_FOUND');continue;}
  if(!['○','△','×'].includes(e.grade)){issue(e.problemId,'INVALID_GRADE');continue;}
  if(!e.date){issue(e.problemId,'MISSING_STUDY_DATE');metadata.undated++;continue;}
  if(e.date>today){issue(e.problemId,'FUTURE_STUDY_DATE');continue;}
  const reportedDay=e.recorded&&e.recorded>e.date?e.recorded:e.date;
  const r={submissionId:e.id,attemptId:e.id,problem,studyDay:e.date,
    reportedDay:reportedDay>today?today:reportedDay,grade:e.grade,
    policyRevision:'v0.3',raw:e.grade,source:e.id};
  bucket.reports.push(r);
  if(!bucket.latestStudyDay||e.date>bucket.latestStudyDay)bucket.latestStudyDay=e.date;
 }
 // Correction flags on source IDs affect the replacement problem, even when the
 // corrected original belongs to another (parent/child) target.
 for(const [problemId,issues] of Object.entries(issueById)){
  let key;try{key=rc11DailyKey_(rc11DailyLegacyProblem_(problemId));}catch{continue;}
  if(!byKey[key])byKey[key]={problem:rc11DailyLegacyProblem_(problemId),sourceIds:[],reports:[],issues:[],latestStudyDay:null};
  for(const message of issues)if(!byKey[key].issues.includes(message))byKey[key].issues.push(message);
 }
 
 // Honor only explicit, already-applied user graduation exceptions.
 // Other Reports rows describe sources/overrides, not additional grade attempts.
 const forced=[];
 for(const row of rawReportItems) {
  if(row.Status!=='APPLIED'||!row.ItemJSON)continue;
  let item;try{item=JSON.parse(row.ItemJSON);}catch{continue;}
  const kind=item.overrideType||item.type;
  if(kind!=='FORCE_GRADUATE'||!item.targetId)continue;
  const date=rc11HistoryDate_(item.effectiveFrom||row.SentAt);
  if(!date||date>today)continue;
  let problem;try{problem=rc11DailyLegacyProblem_(String(item.targetId));}catch{continue;}
  forced.push({problem,date,scope:item.value?.scope||'SELF'});
 }
 if(forced.length){
  // Existing known targets + the exact forced targets. Unknown siblings are not created.
  for(const x of forced){
   const key=rc11DailyKey_(x.problem);
   if(!byKey[key])byKey[key]={problem:x.problem,sourceIds:[],reports:[],issues:[],latestStudyDay:null};
  }
  for(const entry of Object.values(byKey)){
   for(const x of forced){
    const p=x.problem,target=entry.problem;
    const same=p.materialId===target.materialId&&p.editionId===target.editionId&&
     p.problemKind===target.problemKind&&p.problemNumber===target.problemNumber;
    const descendant=target.subquestionPath.length>p.subquestionPath.length&&
     p.subquestionPath.every((segment,i)=>segment===target.subquestionPath[i]);
    if(!same||(!descendant&&rc11DailyKey_(p)!==rc11DailyKey_(target)))continue;
    if(descendant&&x.scope!=='SELF_AND_DESCENDANTS')continue;
    if(!entry.forcedGraduatedAt||entry.forcedGraduatedAt<x.date)entry.forcedGraduatedAt=x.date;
   }
  }
 }

 for(const entry of Object.values(byKey)){
  entry.reports.sort((a,b)=>a.studyDay.localeCompare(b.studyDay)||
   reportOrder.get(a.submissionId).time-reportOrder.get(b.submissionId).time||
   reportOrder.get(a.submissionId).index-reportOrder.get(b.submissionId).index);
  const effective=new Map();
  for(const r of entry.reports)effective.set(r.studyDay,r);
  metadata.collapsedSameDay+=entry.reports.length-effective.size;
  entry.reports=[...effective.values()];
  if(entry.forcedGraduatedAt)metadata.explicitGraduations++;
  if(entry.issues.length)metadata.heldProblems++;
  else if(entry.reports.length)metadata.replayableProblems++;
  metadata.issues+=entry.issues.length;
 }
 return {byKey,metadata,sourceTabNames:['EventLog','RC11V2_Results']};
}


/** Owner-adjudicated 2026-11-02 reconciliation. Source rows are never rewritten.
 * Checkpoints express the 33 supplied decisions, not invented grade reports.
 * New daily reports continue from each checkpoint under review policy v0.3.
 */
function rc11DailyHistoryDecisions_(){
 const decisions=[];
 const add=(material,numbers,stage)=>numbers.forEach(n=>decisions.push({id:material+':'+n,stage}));
 add('PHYS_RYOMON',['25','26','27','28','30','78','80','81','82','84','87','88'],'GRADUATED');
 add('CHEM_JUMON',['85','97','99','130(1)','130(2)'],'GRADUATED');
 add('MATH_PLA',['144'],'GRADUATED');add('MATH_AOCHAC',['109'],'GRADUATED');
 add('CHEM_SEMINAR',['295(1)','296(1)'],'R1');
 add('MATH_CLEAR3C',['2(2)(3)'],'R1');
 add('MATH_STANDARD',['11(2)','35(2)','48(3)'],'R1');
 add('PHYS_RYOMON',['27(2)'],'R1');
 add('CHEM_SEMINAR',['293(3)'],'R2');add('PHYS_RYOMON',['76(1)'],'R2');
 add('PHYS_RYOMON',['29'],'R3');
 add('CHEM_JUMON',['130(*)','191(*)'],'SCOPE');
 add('CHEM_SEMINAR',['293(*)'],'SCOPE');add('MATH_PLA',['144(*)'],'SCOPE');
 return decisions;
}
function rc11DailyRepairHistoryNeeded_(s){
 return !!s.legacy&&!s.legacy.historyReconciliation?.['2026-11-02-33'];
}
function rc11DailyRepairHistoryState_(s,tables,today){
 if(!rc11DailyRepairHistoryNeeded_(s))return {status:'ALREADY_APPLIED',applied:0};
 const rebuilt=rc11HistoryBuild_(tables,today),decisions=rc11DailyHistoryDecisions_();
 s.legacy.resolutions=s.legacy.resolutions||{};
 const counts={GRADUATED:0,R1:0,R2:0,R3:0,SCOPE:0},applied=[];
 for(const decision of decisions){
  const problem=rc11DailyLegacyProblem_(decision.id),key=rc11DailyKey_(problem);
  const work=s.catalog.work.find(w=>rc11DailyKey_(w.problem)===key);
  if(!work&&!s.legacy.history?.[key]&&!s.legacy.states?.[key])continue;
  const entry=rebuilt.byKey[key]||s.legacy.history?.[key];
  // Retain original source IDs and raw reports; only effective replay is deduplicated.
  if(entry)s.legacy.history[key]=entry;
  const history=entry?.reports||[],old=s.legacy.states?.[key];
  let last=history[history.length-1]?.studyDay||old?.lastStudyDay||null;
  // The approved 293(3) R1 completion was reported at its known parent on 10/13.
  // This supplies a checkpoint date, never a copied/fabricated sibling grade.
  let related=[];
  if(decision.id==='CHEM_SEMINAR:293(3)'){
   related=rebuilt.byKey[rc11DailyKey_({...problem,subquestionPath:[]})]?.reports||[];
   if(related.length&&(!last||related[related.length-1].studyDay>last))last=related[related.length-1].studyDay;
  }
  if(decision.stage!=='SCOPE'&&!rc11HistoryDate_(last))throw Error('REPAIR_ANCHOR_MISSING:'+decision.id);
  const first=history[0]?.studyDay||last;
  const resolution={id:'2026-11-02-33:'+decision.id,stage:decision.stage,
   lastStudyDay:last,attemptCount:Math.max(1,history.length),
   anchorReport:history[0]||null,
   sourceIds:[...(entry?.sourceIds||[]),...related.map(r=>r.source)],
   decisionSource:'OWNER_ADJUDICATION_2026_11_02',policyRevision:'v0.3'};
  if(decision.stage==='R1'){
   resolution.idealReviewDate=rc11DailyPlus_(last,1);
   resolution.secondReviewDate=rc11DailyPlus_(last,3);
  }else if(decision.stage==='R2'){
   const original=rc11DailyPlus_(first,3),afterR1=rc11DailyPlus_(last,1);
   resolution.idealReviewDate=original>afterR1?original:afterR1;
  }else if(decision.stage==='R3')resolution.idealReviewDate=rc11DailyPlus_(last,3);
  s.legacy.resolutions[key]=resolution;
  if(work&&decision.stage!=='SCOPE')work.remainderPassed=false;
  counts[decision.stage]++;applied.push(decision.id);
 }
 const result={id:'2026-11-02-33',status:'APPLIED',applied:applied.length,counts,
  sourceDigest:rc11DailyHash_(tables),appliedAtStudyDay:today,targets:applied};
 s.legacy.historyReconciliation={...s.legacy.historyReconciliation,'2026-11-02-33':result};
 s.dirty=true;
 return result;
}
function rc11DailyResolvedReview_(resolution,problem,reports,today){
 if(resolution.stage==='SCOPE')return {status:'SCOPE',reasons:[]};
 const toOb=(stage,date)=>({occurrenceId:JSON.stringify(['v0.3',resolution.id,
  rc11DailyKey_(problem),stage,date]),problem,stage,idealReviewDate:date});
 let obligations=resolution.stage==='GRADUATED'?[]:[toOb(resolution.stage,resolution.idealReviewDate)];
 if(resolution.stage==='R1')obligations.push(toOb('R2',resolution.secondReviewDate));
 const sorted=rc11DailyEffectiveReports_(reports);
 let checkpoint={first:resolution.anchorReport||sorted[0],lastStudyDay:resolution.lastStudyDay,
  attemptCount:resolution.attemptCount,graduated:resolution.stage==='GRADUATED',obligations};
 for(const r of sorted){
  if(r.studyDay<resolution.lastStudyDay)return {status:'HOLD',reasons:['REPORT_PREDATES_REVIEWED_CHECKPOINT']};
  // A later report on the checkpoint day replaces that day's grade. It never
  // completes another review on the same day or advances R1 twice.
  if(r.studyDay===checkpoint.lastStudyDay){
   if(RC11Next.replayDaily([r],today).status!=='ready')
    return {status:'HOLD',reasons:['INVALID_POST_IMPORT_REPORT']};
   if(rc11DailyKey_(r.problem)!==rc11DailyKey_(problem))return {status:'HOLD',reasons:['MIXED_TARGET']};
   if(checkpoint.graduated&&r.grade!=='○'){
    checkpoint={first:r,lastStudyDay:r.studyDay,attemptCount:checkpoint.attemptCount,
     graduated:false,obligations:[toOb('R1',rc11DailyPlus_(r.studyDay,1)),toOb('R2',rc11DailyPlus_(r.studyDay,3))]};
   }else if(['R1','R3'].includes(resolution.stage)&&r.grade==='○')checkpoint={...checkpoint,graduated:true,obligations:[]};
   continue;
  }
  const step=RC11Next.advanceReview(checkpoint,r,today,true);
  if(step.status!=='ready')return {status:'HOLD',reasons:[step.reason]};
  checkpoint=step.checkpoint;
 }
 return {status:'ready',graduated:checkpoint.graduated,attemptCount:checkpoint.attemptCount,
  obligations:checkpoint.obligations};
}
/** Reconcile an already initialized runtime. Never resets imports, reports or bindings. */
function rc11DailyRepairHistory(){return rc11DailyLock_(function(){
 const opened=rc11DailyOpen_(),loaded=rc11DailyRead_(opened.store),s=loaded.state;
 if(s.pending)return {status:'SYNC_PENDING',reason:'FINISH_EXISTING_SYNC_FIRST'};
 if(!rc11DailyRepairHistoryNeeded_(s))return {status:'ALREADY_APPLIED',applied:0};
 const today=rc11NextCurrentStudyDay_(),result=rc11DailyRepairHistoryState_(s,rc11DailyReadLegacy_().tables,today);
 s.plan=rc11DailyPlan_(s,today,rc11NextTokyoInstant_());s.dirty=false;
 rc11DailySave_(opened.store,s,loaded.head,{type:'HISTORY_RECONCILIATION',...result});
 const output={status:result.status,applied:result.applied,counts:result.counts,heldCount:s.plan.held.length};
 console.log('RC11_HISTORY_REPAIR '+JSON.stringify(output));return output;
});}

/** Read the existing sheet once as migration input. Never adopt old Todoist IDs. */
function rc11DailyTable_(ss,name){const sh=ss.getSheetByName(name);if(!sh)return [];const width=sh.getLastColumn(),last=sh.getLastRow();if(last<1)return [];if(last>20000||width>100)throw Error('SOURCE_RANGE_TOO_LARGE:'+name);const values=sh.getRange(1,1,last,width).getDisplayValues(),header=values.shift();return values.filter(r=>r.some(x=>x!=='')).map(r=>Object.fromEntries(header.map((h,i)=>[h,r[i]||''])));}
function rc11DailyLegacyProblem_(id){const m=/^([^:]+):(\d+[A-Za-z]?)((?:\([A-Za-z0-9.*]+\))*)$/.exec(id);if(!m)throw Error('LEGACY_PROBLEM_ID:'+id);return {materialId:m[1],editionId:'legacy-preserved',problemKind:'exercise',problemNumber:m[2],subquestionPath:[...m[3].matchAll(/\(([^)]+)\)/g)].flatMap(x=>x[1].split('.'))};}
function rc11DailyExpand_(scope){const out=[];for(const token of String(scope).replace(/[〜～–]/g,'-').split(/[,、\s]+/).filter(Boolean)){const m=/^(\d+)-(\d+)$/.exec(token);if(m){if(+m[2]<+m[1]||+m[2]-+m[1]>5000)throw Error('SCOPE_RANGE');for(let n=+m[1];n<=+m[2];n++)out.push(String(n));}else if(/^\d+[A-Za-z]?(?:\([\d.]+\))?$/.test(token))out.push(token);else throw Error('SCOPE_TOKEN:'+token);}return [...new Set(out)];}
function rc11DailyLegacyConvert_(tables,today){
 const s=rc11DailyEmpty_(),config=Object.fromEntries((tables.RC11V2_Config||[]).map(r=>[r.Key,r.Value])),work=new Map();
 const add=(problem,data)=>{const key=rc11DailyKey_(problem),old=work.get(key);work.set(key,{...rc11DailyWork_({problem}),...old,...data,problem});};
 for(const g of tables.RC11V2_Goals||[]){
  const active=g.Status==='ACTIVE';
  for(const number of rc11DailyExpand_(g.Scope)){const p=rc11DailyLegacyProblem_(g.MaterialID+':'+number),existing=work.get(rc11DailyKey_(p));
   if(existing&&!existing.newPaused&&!active)continue;
   add(p,{newPaused:!active,minutes:Number(g.MinPerItem)||Number(config.NEW_DEFAULT_MIN)||20,priority:Math.max(1,Math.min(4,Math.ceil(Number(g.Priority||4)/3))),rank:Number(g.Priority)||4,firstAttemptBy:g.TargetDate||null,earliestDate:g.StartDate||undefined});
  }
 }
 const history=rc11HistoryBuild_(tables,today);
 s.legacy={states:{},history:history.byKey,historyStats:history.metadata,
  results:tables.RC11V2_Results||[],eventMeta:tables.RC11V21_EventMeta||[],capturedAt:today};
 const fields=['ProblemID','Stage','AttemptNo','LastGrade','LastStudyDate','IdealReviewDate','Graduated','LastResultID','MaterialID','ReviewMinutes','Explanation','UpdatedAt'];
 for(const row of tables.RC11V2_State||[]){
  const p=rc11DailyLegacyProblem_(row.ProblemID),values=fields.map(k=>String(row[k]||''));values[0]=p.materialId+':'+p.problemNumber;const parsed=rc11NextParseLegacyState_(values);parsed.key=row.ProblemID;
  if(parsed.status!=='ready'){
   // Imported evidence is retained; one malformed historical state never blocks other work.
   parsed.stage='HOLD';parsed.key=row.ProblemID;parsed.reasons=[parsed.reason];
 }
  const key=rc11DailyKey_(p);
  if(s.legacy.states[key])throw Error('DUPLICATE_LEGACY_PROBLEM');s.legacy.states[key]=parsed;
  if(!work.has(key))add(p,{newPaused:true,minutes:Number(config.NEW_DEFAULT_MIN)||20,priority:2});
  work.get(key).reviewMinutes=parsed.minutes||Number(config.REVIEW_DEFAULT_MIN)||10;
  if(parsed.stage==='SPLIT')work.get(key).remainderPassed=true;
 }
 for(const entry of Object.values(history.byKey)){
  const key=rc11DailyKey_(entry.problem);
  if(!work.has(key))add(entry.problem,{newPaused:true,minutes:Number(config.NEW_DEFAULT_MIN)||20,
    reviewMinutes:Number(config.REVIEW_DEFAULT_MIN)||10,priority:2});
 }
 s.catalog.work=[...work.values()];s.catalog.horizon=Math.max(7,Math.min(90,Number(config.FORECAST_DAYS)||35));
 s.catalog.materialDisplay=Object.fromEntries((tables.Materials||[]).map(r=>[r.MaterialID,{name:r.Name,subject:r.Subject||''}]));
 const cram=String(config.CRAM_WEEKDAYS||'1,2,4,5,6').split(',').map(Number),cramMin=Number(config.CRAM_MIN)||60;
 s.catalog.weekly=Array.from({length:7},(_,i)=>({totalMinutes:i===0||i===6?Number(config.OFFDAY_TOTAL_MIN)||600:Number(config.WEEKDAY_TOTAL_MIN)||300,fixed:cram.includes(i)?[{id:'cram',startMinute:1080,endMinute:1080+cramMin}]:[]}));
 for(const r of tables.RC11V2_Days||[]){const wd=new Date(r.Date+'T00:00:00Z').getUTCDay(),holiday=r.SchoolHoliday==='TRUE',blocked=r.Blocked==='TRUE';
  s.catalog.days.push({date:r.Date,classification:holiday||wd===0||wd===6?'rest':'weekday',totalMinutes:blocked?0:r.TotalMinutes!==''?Number(r.TotalMinutes):holiday?Number(config.OFFDAY_TOTAL_MIN)||600:s.catalog.weekly[wd].totalMinutes,
   fixed:blocked?[]:r.FixedStudyMinutes!==''?(Number(r.FixedStudyMinutes)>0?[{id:'fixed',startMinute:0,endMinute:Number(r.FixedStudyMinutes)}]:[]):s.catalog.weekly[wd].fixed,capacityExceptionRef:'legacy-day',calendarEvidenceRef:'legacy-day'});
 }
 s.catalog.newMode=['OFF','STOP','DISABLED'].includes(config.NEW_MODE)?'disabled':'enabled';
 s.imported.push({source:'RC11V2',stateRows:(tables.RC11V2_State||[]).length,resultRows:(tables.RC11V2_Results||[]).length,eventRows:(tables.EventLog||[]).length,history:history.metadata,today});
 return s;
}
function rc11DailyReview_(s,problem,reports,today){
 const key=rc11DailyKey_(problem),legacy=s.legacy?.states?.[key];
 const evidence=s.legacy?.history?.[key];
 if(problem.subquestionPath.includes('*'))
   return {status:'SCOPE',reasons:[]};
 const resolved=s.legacy?.resolutions?.[key];
 if(resolved)return rc11DailyResolvedReview_(resolved,problem,reports,today);
 if(evidence?.issues?.length)return {status:'HOLD',reasons:evidence.issues};
 if(evidence?.forcedGraduatedAt&&
   (!evidence.latestStudyDay||evidence.latestStudyDay<=evidence.forcedGraduatedAt))
   return rc11DailyResolvedReview_({id:'legacy-explicit-graduation:'+key,stage:'GRADUATED',
    lastStudyDay:evidence.forcedGraduatedAt,attemptCount:evidence.reports.length||legacy?.attemptCount||1,
    anchorReport:evidence.reports[0]},problem,reports,today);
 // SPLIT parents are coverage indicators, not a proof of every child's grade.
 if(legacy?.stage==='SPLIT')return {status:'HOLD',reasons:['LEGACY_SPLIT_REQUIRES_EXACT_SUBQUESTION']};
 if(evidence?.reports?.length){
  const count=evidence.reports.length;
  // A snapshot may include attempts absent from either migrated event table.
  // Do not silently discard those attempts and mistake an old ○ for an initial ○.
  const incomplete=legacy?.status==='ready'&&legacy.stage!=='NEW'&&
    (legacy.attemptCount>count||
     (legacy.lastStudyDay&&evidence.latestStudyDay&&legacy.lastStudyDay>evidence.latestStudyDay));
  if(!incomplete){
    const replay=RC11Next.replayDaily(evidence.reports.concat(reports),today);
    if(replay.status!=='ready')return replay;
    return {...replay,attemptCount:count+reports.length};
  }
 }
 if(legacy?.status==='HOLD')return {status:'HOLD',reasons:legacy.reasons||['LEGACY_STATE_INVALID']};
 if(!legacy||legacy.stage==='NEW'&&legacy.attemptCount===0)
  return reports.length?RC11Next.replayDaily(reports,today):{status:'NEW'};
 const sorted=reports.slice().sort((a,b)=>a.studyDay.localeCompare(b.studyDay));
 for(const r of sorted){
  const checked=RC11Next.replayDaily([r],today);
  if(checked.status!=='ready'||rc11DailyKey_(r.problem)!==key)
   return {status:'HOLD',reasons:['INVALID_POST_IMPORT_REPORT']};
 }
 // The strict archival snapshot reader remains unchanged. Daily operation also
 // accepts post-graduation confirmations and starts a new cycle on △ or ×.
 const state=legacy.graduated
  ?rc11DailyResolvedReview_({id:'legacy-graduation',stage:'GRADUATED',
    lastStudyDay:legacy.lastStudyDay,attemptCount:legacy.attemptCount},problem,sorted,today)
  :rc11NextStateFromSnapshot_(legacy,sorted,today);
 if(state.status==='ready')state.obligations=state.obligations.map(o=>({...o,problem}));
 return state;
}
function rc11DailyReadLegacy_(){const id=rc11DailyProps_().getProperty('RC11_LEGACY_SPREADSHEET_ID')||rc11DailyProps_().getProperty('RC11_SHEET_ID');if(!id)throw Error('LEGACY_SPREADSHEET_NOT_CONFIGURED');const ss=SpreadsheetApp.openById(id),tables={};for(const name of ['RC11V2_Config','RC11V2_Goals','RC11V2_State','EventLog','Reports','RC11V2_Results','RC11V21_EventMeta','RC11V2_Days','Materials'])tables[name]=rc11DailyTable_(ss,name);return {id,tables};}
function rc11DailyPreviewImport(){const source=rc11DailyReadLegacy_(),s=rc11DailyLegacyConvert_(source.tables,rc11NextCurrentStudyDay_());s.plan=rc11DailyPlan_(s,rc11NextCurrentStudyDay_(),rc11NextTokyoInstant_());return {status:'PREVIEW',source:source.id,work:s.catalog.work.length,legacyStates:Object.keys(s.legacy.states).length,history:s.legacy.historyStats,summary:rc11DailySummary_(s,rc11NextCurrentStudyDay_()),oldTodoistIdsImported:false};}
function rc11DailyImportLegacy(){return rc11DailyLock_(function(){const {store}=rc11DailyOpen_(),loaded=rc11DailyRead_(store);if(loaded.state.revision||loaded.state.catalog.work.length)return {status:'ALREADY_INITIALIZED'};const source=rc11DailyReadLegacy_(),s=rc11DailyLegacyConvert_(source.tables,rc11NextCurrentStudyDay_());s.plan=rc11DailyPlan_(s,rc11NextCurrentStudyDay_(),rc11NextTokyoInstant_());s.dirty=false;rc11DailySave_(store,s,loaded.head,{type:'IMPORT',sourceId:source.id,sourceDigest:rc11DailyHash_(source.tables)});return {status:'IMPORTED',work:s.catalog.work.length,legacyStates:Object.keys(s.legacy.states).length,history:s.legacy.historyStats,oldTodoistIdsImported:false};});}


/**
 * Presentation only: human-friendly titles following legacy RC11 style.
 * The hidden RC11_NEXT_ID description remains the durable ownership marker.
 * No old Todoist task ID is ever read or adopted.
 */
function rc11NextVisibleTitle_(plan,group,occurrences) {
  if(!Array.isArray(occurrences)||!occurrences.length||
     occurrences.some(o=>!o||!o.problem||!o.problem.materialId||
       typeof o.problem.problemNumber!=='string'||!Array.isArray(o.problem.subquestionPath)))
    throw Error('DISPLAY_MEMBERS_INVALID');
  const material=occurrences[0].problem.materialId;
  if(occurrences.some(o=>o.problem.materialId!==material))
    throw Error('DISPLAY_MIXED_MATERIAL');
  const presets={
    'MATH_PLA':{subject:'数学',name:'理系プラチカ'},
    'PHYS_RYOMON':{subject:'物理',name:'良問の風'},
    'CHEM_JUMON':{subject:'化学',name:'重要問題集'},
    'CHEM_SEMINAR':{subject:'化学',name:'セミナー'},
    'MATH_BLUE':{subject:'数学',name:'青チャート'},
    'ENG_SOKUJUKU':{subject:'英語',name:'速読英熟語'}
  };
  const fromCatalog=plan&&plan.materialDisplay&&plan.materialDisplay[material];
  const descriptor=(fromCatalog&&typeof fromCatalog==='object'&&
    typeof fromCatalog.name==='string'&&typeof fromCatalog.subject==='string')
      ?fromCatalog:(presets[material]||{subject:'',name:material});
  const printable=s=>typeof s==='string'&&s.length<90&&!/[\r\n\u0000-\u001f]/.test(s);
  if(!printable(descriptor.subject)||!printable(descriptor.name))
    throw Error('DISPLAY_NAME_INVALID');
  const parts=occurrences.map(o=>o.problem.problemNumber+
    (o.problem.subquestionPath.length?'('+o.problem.subquestionPath.join('.')+')':''));
  const stage=group.stage==='NEW'?'':'復習 ';
  const visible=(descriptor.subject?descriptor.subject+'｜':'')+
    descriptor.name+' '+stage+parts.join('・');
  if(visible.length>500)throw Error('DISPLAY_TITLE_TOO_LONG');
  return visible;
}

/**
 * RC11 Next GAS V8 pure-preview entrypoints.
 *
 * NOT the legacy rc11ProductionTick. No triggers, OAuth, installation,
 * Todoist writes, migration, history mutation or other side effects.
 * Generated dist-gas/Code.gs includes the existing bundled domain code.
 * It is not a production runtime and cannot replace the current writer.
 */
function rc11NextGasStatus() {
  return {
    mode: 'READ_ONLY_GAS_PREVIEW',
    version: 1,
    domainRules: 'EXISTING_V0.3_UNMODIFIED',
    sourceOfTruth: 'NOT_CONNECTED',
    persistentStore: 'NOT_CONNECTED',
    todoist: 'DISABLED',
    triggers: 'NOT_INSTALLED',
    deploymentApproved: false,
    productionActive: false,
    executionAuthorized: false
  };
}
function rc11NextPreviewReview(reports, asOf) {
  return RC11Next.replay(reports, asOf);
}
function rc11NextPreviewException(raw, context) {
  return RC11Next.normalizeException(raw, context);
}
function rc11NextPreviewPlan(input) {
  return RC11Next.simulatePlan(input);
}
function rc11NextPreviewGroups(occurrences) {
  return RC11Next.chunkOccurrences(occurrences);
}
function rc11NextPreviewStudyDay(instant) {
  return RC11Next.studyDay(instant);
}
