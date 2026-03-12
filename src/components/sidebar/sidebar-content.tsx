/** biome-ignore-all lint/a11y/useAriaPropsSupportedByRole: <TO DO> */
'use client';

import {
  Plus as AddIcon,
  ArrowLeftToLine,
  ArrowRightToLine,
  X as CloseButton,
  Menu,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from 'react';

import { searchPromptAction } from '@/app/actions/prompt.actions';
import { Logo } from '@/components/logo';
import { PromptList } from '@/components/prompts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import type { PromptSummary } from '@/core/domain/prompts/prompt.entity';

export type SidebarContentProps = {
  prompts: PromptSummary[];
};

const fadeTransition = { duration: 0.2, delay: 0.1 };

export const SidebarContent = ({ prompts }: SidebarContentProps) => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [searchState, searchAction, isPending] = useActionState(
    searchPromptAction,
    {
      success: true,
      prompts,
    }
  );

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [query, setQuery] = useQueryState('q', { defaultValue: '' });

  const hasQuery = query.trim().length > 0;
  const promptList = hasQuery ? (searchState.prompts ?? prompts) : prompts;

  function collapsedSidebar() {
    setIsCollapsed(true);
  }
  function expandSidebar() {
    setIsCollapsed(false);
  }

  function openMobile() {
    setIsMobileOpen(true);
  }
  function closeMobile() {
    setIsMobileOpen(false);
  }

  function handleNewPrompt() {
    router.push('/new');
  }

  function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newQuery = event.target.value;
    setQuery(newQuery);

    startTransition(() => {
      formRef.current?.requestSubmit();
    });
  }

  useEffect(() => {
    if (!hasQuery) {
      return;
    }
    formRef.current?.requestSubmit();
  }, [hasQuery]);

  return (
    <>
      <Button
        className="fixed top-6 left-6 z-50 md:hidden"
        variant="secondary"
        title="Abrir menu"
        aria-label="Abrir menu"
        aria-expanded={isMobileOpen}
        onClick={openMobile}
      >
        <Menu className="h-5 w-5 text-gray-100" />
      </Button>
      <motion.aside
        className={`fixed top-0 left-0 z-50 flex h-full w-[80vw] flex-col border-gray-700 border-r bg-gray-800 transition-[transform,width] duration-300 ease-in-out sm:w-[320px] md:relative md:z-auto ${isCollapsed ? 'md:w-18' : 'md:w-[384px]'} ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        initial={false}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {isCollapsed && (
          <section className="px-2 py-6">
            <header className="mb-6 flex items-center justify-center">
              <Button
                onClick={expandSidebar}
                variant="icon"
                className="rounded-lg p-2 transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-500 md:inline-flex"
                aria-label="Expandir sidebar"
                title="Expandir sidebar"
              >
                <ArrowRightToLine className="h-5 w-5 text-gray-100" />
              </Button>
            </header>

            <motion.div
              className="flex flex-col items-center space-y-4"
              initial={false}
              animate={{ opacity: 1 }}
              transition={fadeTransition}
            >
              <Button
                onClick={handleNewPrompt}
                aria-label="Novo prompt"
                title="Novo prompt"
              >
                <AddIcon className="h-5 w-5 text-white" />
              </Button>
            </motion.div>
          </section>
        )}

        {!isCollapsed && (
          <>
            <section className="p-6">
              <div className="mb-4 md:hidden">
                <div className="flex items-center justify-between">
                  <Button
                    variant="secondary"
                    aria-label="Fechar menu"
                    title="Fechar menu"
                    onClick={closeMobile}
                  >
                    <CloseButton className="h-5 w-5 text-gray-100" />
                  </Button>
                </div>
              </div>
              <motion.div
                className="mb-6 flex w-full items-center justify-between"
                initial={false}
                animate={{ opacity: 1 }}
                transition={fadeTransition}
              >
                <header className="flex w-full items-center justify-between">
                  <Logo />
                  <Button
                    onClick={collapsedSidebar}
                    variant="icon"
                    className="rounded-lg p-2 transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-500 md:inline-flex"
                    title="Minimizar sidebar"
                    aria-label="Minimizar sidebar"
                  >
                    <ArrowLeftToLine className="h-5 w-5 text-gray-100" />
                  </Button>
                </header>
              </motion.div>

              <section className="mb-5">
                <form
                  ref={formRef}
                  action={searchAction}
                  className="group relative w-full"
                >
                  <Input
                    name="q"
                    type="text"
                    value={query}
                    placeholder="Buscar prompts..."
                    onChange={handleQueryChange}
                    autoFocus
                  />
                  {isPending && (
                    <div
                      title="Carregando prompts"
                      aria-label="Carregando prompts"
                      className="-translate-y-1/2 absolute top-1/2 right-2 flex items-center gap-2 text-gray-300"
                    >
                      <Spinner />
                    </div>
                  )}
                </form>
              </section>

              <motion.div
                initial={false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={fadeTransition}
              >
                <Button onClick={handleNewPrompt} className="w-full" size="lg">
                  <AddIcon className="mr-2 h-5 w-5" />
                  Novo prompt
                </Button>
              </motion.div>
            </section>

            <motion.nav
              className="flex-1 overflow-auto px-6 pb-6"
              aria-label="Lista de prompts"
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fadeTransition}
            >
              <PromptList prompts={promptList} />
            </motion.nav>
          </>
        )}
      </motion.aside>
    </>
  );
};
