import { Link } from "react-router-dom";

import DashboardHeader from "../features/dashboardHome/components/DashboardHeader";
import StatCard from "../features/dashboardHome/components/StatCard";
import SimpleInfoCard from "../features/dashboardHome/components/SimpleInfoCard";
import ActivityCard from "../features/dashboardHome/components/ActivityCard";
import ListItem from "../features/dashboardHome/components/ListItem";
import StatusPill from "../features/dashboardHome/components/StatusPill";
import Donut from "../features/dashboardHome/components/Donut";
import MiniBarChart from "../features/dashboardHome/components/MiniBarChart";
import DropdownCard from "../features/dashboardHome/components/DropdownCard";
import Todolist from "../features/dashboardHome/components/Todolist";

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
    addTodo,
    toggleTodo,
    deleteTodo,
  } = useDashboardHomeData();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <DashboardHeader />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Program totalt"
          value={stats.programsTotal}
          hint="Redo att återanvändas"
        />
        <StatCard
          label="Pågående"
          value={stats.ongoingTotal}
          hint="Aktiva just nu"
        />
        <StatCard
          label="Klara"
          value={stats.doneTotal}
          hint="Avslutade flöden"
        />
        <StatCard
          label="Ej startade"
          value={stats.needsActionTotal}
          hint="Väntar på start"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:auto-rows-fr items-stretch">
        <SimpleInfoCard
          title="Ny aktivitet"
          description="Senaste händelserna i systemet."
          className="lg:col-start-1 lg:row-start-1"
        >
          {loading ? (
            <div className="text-sm text-slate-500">Laddar...</div>
          ) : (
            <DropdownCard
              items={activityFeed}
              maxItems={4}
              emptyMessage="Ingen aktivitet ännu"
              renderItem={(e) => (
                <ActivityCard
                  key={e.id}
                  title={e.title}
                  subtitle={e.subtitle}
                  rightText={e.time}
                />
              )}
            />
          )}
        </SimpleInfoCard>

        <SimpleInfoCard
          title="Aktiva onboardings"
          description="Snabbstatus per nyanställd."
          className="lg:col-start-2 lg:row-start-1"
        >
          {loading ? (
            <div className="text-sm text-slate-500">Laddar...</div>
          ) : (
            <DropdownCard
              items={activeOnboardings}
              maxItems={4}
              emptyMessage="Inga aktiva onboardings"
              renderItem={(a) => (
                <Link key={a.id} to={`/onboardings/${a.id}`}>
                  <ListItem
                    title={a.name}
                    subtitle={a.role}
                    right={<StatusPill status={a.status} />}
                  />
                </Link>
              )}
            />
          )}
        </SimpleInfoCard>

        <SimpleInfoCard
          title="Kommande"
          description="Det som händer snart."
          className="lg:col-start-3 lg:row-start-1"
        >
          {loading ? (
            <div className="text-sm text-slate-500">Laddar...</div>
          ) : (
            <DropdownCard
              items={upcoming}
              maxItems={4}
              emptyMessage="Inget kommande ännu"
              renderItem={(u) => (
                <ActivityCard
                  key={u.id}
                  title={u.title}
                  subtitle={u.subtitle}
                  rightText={u.when}
                />
              )}
            />
          )}
        </SimpleInfoCard>

        <SimpleInfoCard
          title="Goals"
          description="Progress & aktivitet."
          className="lg:col-start-1 lg:col-span-2 lg:row-start-2"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <Donut value={goals.weekPercent} label="För veckan" />
              <div className="mt-3 text-sm text-slate-500">Välj onboarding</div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <Donut value={goals.monthPercent} label="För månaden" />
              <div className="mt-2 text-sm text-slate-500">
                Avsluta onboardings
              </div>
            </div>
          </div>

          <div className="mt-6">
            <MiniBarChart data={activity7d} />
          </div>
        </SimpleInfoCard>

        <SimpleInfoCard
          title={
            <div className="flex items-center justify-between">
              Att göra lista
              <span className="text-xs font-medium bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                {todos.filter((t) => !t.completed).length} kvar
              </span>
            </div>
          }
          description="Snabba åtgärder för HR/chef."
          className="lg:col-start-3 lg:row-start-2 "
        >
          <Todolist
            todos={todos}
            loading={loading}
            onAdd={addTodo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        </SimpleInfoCard>
      </div>
    </div>
  );
}
