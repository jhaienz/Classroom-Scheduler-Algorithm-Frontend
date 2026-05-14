'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, BookOpen, Calendar, Zap } from 'lucide-react';
import { ThemeProvider } from '@/components/theme-provider';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Classrooms', href: '/classrooms', icon: Users },
  { name: 'Courses', href: '/courses', icon: BookOpen },
  { name: 'Schedules', href: '/schedules', icon: Calendar },
  { name: 'Optimizer', href: '/optimizer', icon: Zap },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background/60 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-2 px-6 border-b border-border/50">
        <Zap className="h-6 w-6 text-primary" />
        <span className="font-bold tracking-tight text-lg">Greedy Scheduler</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <nav className="flex flex-col gap-1.5">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
