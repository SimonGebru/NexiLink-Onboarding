import { Link } from "react-router-dom";

import DashboardHeader from "../features/dashboardHome/components/DashboardHeader";
import StatCard from "../features/dashboardHome/components/StatCard";
import SimpleInfoCard from "../features/dashboardHome/components/SimpleInfoCard";
import ActivityCard from "../features/dashboardHome/components/ActivityCard";
import ListItem from "../features/dashboardHome/components/ListItem";
import StatusPill from "../features/dashboardHome/components/StatusPill";
import Donut from "../features/dashboardHome/components/Donut";
import MiniBarChart from "../features/dashboardHome/components/MiniBarChart";

import { useDashboardHomeData } from "../features/dashboardHome/hooks/useDashboardHomeData";

export default function DashboardHome() {
  const {
    loading,
    activeOnboardings,
    activityFeed,
    upcoming,
    todos,
    goals,
    activity7d,
    stats,
  } = useDashboardHomeData();

  return (
    <div className="space-y-6">
      <DashboardHeader />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Program totalt"
          value={stats.programsTotal}
          hint="Redo att återanvändas"
        />
        <StatCard
          label="Pågående onboardings"
          value={stats.ongoingTotal}
          hint="Aktiva just nu"
        />
        <StatCard label="Klara" value={stats.doneTotal} hint="Avslutade flöden" />
        <StatCard
          label="Behöver åtgärd"
          value={stats.needsActionTotal}
          hint="Ej startade onboardings"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        <SimpleInfoCard
          title="Ny aktivitet"
          description="Senaste händelserna i systemet."
          className="lg:col-start-1 lg:row-start-1"
        >
          {loading ? (
            <div className="text-sm text-slate-500">Laddar...</div>
          ) : activityFeed.length > 0 ? (
            activityFeed.map((e) => (
              <ActivityCard
                key={e.id}
                title={e.title}
                subtitle={e.subtitle}
                rightText={e.time}
              />
            ))
          ) : (
            <div className="text-sm text-slate-500">Ingen aktivitet ännu</div>
          )}
        </SimpleInfoCard>

        <SimpleInfoCard
          title="Aktiva onboardings"
          description="Snabbstatus per nyanställd."
          className="lg:col-start-2 lg:row-start-1"
        >
          {loading ? (
            <div className="text-sm text-slate-500">Laddar...</div>
          ) : activeOnboardings.length > 0 ? (
            activeOnboardings.map((a) => (
              <Link key={a.id} to={`/onboardings/${a.id}`}>
                <ListItem
                  title={a.name}
                  subtitle={a.role}
                  right={<StatusPill status={a.status} />}
                />
              </Link>
            ))
          ) : (
            <div className="text-sm text-slate-500">Inga aktiva onboardings</div>
          )}
        </SimpleInfoCard>

        <SimpleInfoCard
          title="Kommande"
          description="Det som händer snart."
          className="lg:col-start-3 lg:row-start-1"
        >
          {loading ? (
            <div className="text-sm text-slate-500">Laddar...</div>
          ) : upcoming.length > 0 ? (
            upcoming.map((u) => (
              <ActivityCard
                key={u.id}
                title={u.title}
                subtitle={u.subtitle}
                rightText={u.when}
              />
            ))
          ) : (
            <div className="text-sm text-slate-500">Inget kommande ännu</div>
          )}
        </SimpleInfoCard>

        
        <SimpleInfoCard
          title="Goals"
          description="Progress & aktivitet."
          className="lg:col-start-1 lg:col-span-2 lg:row-start-2"
        >
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <Donut value={goals.weekPercent} label="För veckan" />
              <div className="mt-2 text-sm text-slate-500">Välj onboarding</div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <Donut value={goals.monthPercent} label="För månaden" />
              <div className="mt-2 text-sm text-slate-500">Avsluta onboardings</div>
            </div>
          </div>

          <MiniBarChart data={activity7d} />
        </SimpleInfoCard>

        {/*Och Todo tillbaka i kolumn 3 */}
        <SimpleInfoCard
          title="Todo"
          description="Snabba åtgärder för HR/chef."
          className="lg:col-start-3 lg:row-start-2"
        >
          {loading ? (
            <div className="text-sm text-slate-500">Laddar...</div>
          ) : todos.length > 0 ? (
            todos.map((t) => (
              <Link key={t.id} to="/onboarding/assign">
                <ListItem
                  title={t.title}
                  subtitle={t.subtitle}
                  right={<StatusPill status={t.status} />}
                />
              </Link>
            ))
          ) : (
            <div className="text-sm text-slate-500">Inga todos just nu</div>
          )}
        </SimpleInfoCard>
      </div>
    </div>
  );
}
