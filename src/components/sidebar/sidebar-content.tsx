'use client';

import {
  Plus as AddIcon,
  ArrowLeftToLine,
  ArrowRightToLine,
  X as CloseIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';

export function SidebarContent() {
  const router = useRouter();

  const [isCollapsed, setIsCollapsed] = useState(false);

  function collapseSidebar() {
    setIsCollapsed(true);
  }

  function expandSidebar() {
    setIsCollapsed(false);
  }

  function handleNewPrompt() {
    router.push('/new');
  }

  return (
    <aside
      className={`fixed top-0 left-0 z-50 flex h-full w-[80vw] flex-col border-gray-700 border-r bg-gray-800 transition-[transform,width] duration-300 ease-in-out sm:w-[320px] md:relative md:z-auto ${isCollapsed ? 'md:w-18' : 'md:[w-384px]'}`}
    >
      {isCollapsed && (
        <section className="px-2 py-6">
          <header className="mb-6 flex items-center justify-center">
            <Button
              title="Expandir sidebar"
              aria-label="Expandir sidebar"
              variant="icon"
              className="hidden rounded-lg p-2 transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-500 md:inline-flex"
              onClick={expandSidebar}
            >
              <ArrowRightToLine className="h-5 w-5 text-gray-100" />
            </Button>
          </header>
        </section>
      )}

      {!isCollapsed && (
        <section className="p-6">
          <div className="mb-4 md:hidden">
            <div className="flex items-center justify-between">
              <Button
                variant="secondary"
                aria-label="Fechar Menu"
                title="Fechar menu"
              >
                <CloseIcon className="h-5 w-5 text-gray-100" />
              </Button>
            </div>
          </div>
          <div className="mb-6 flex w-full items-center justify-between">
            <header className="flex w-full items-center justify-between">
              <Logo />
              <Button
                onClick={collapseSidebar}
                className="hidden rounded-lg p-2 transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-500 md:inline-flex"
                variant="icon"
                title="Minimizar sidebar"
                aria-label="Minimizar sidebar"
              >
                <ArrowLeftToLine className="h-5 w-5 text-gray-100" />
              </Button>
            </header>
          </div>

          <div>
            <Button onClick={handleNewPrompt} className="w-full" size="lg">
              <AddIcon className="mr-2 h-5 w-5" />
              Novo prompt
            </Button>
          </div>
        </section>
      )}
    </aside>
  );
}
