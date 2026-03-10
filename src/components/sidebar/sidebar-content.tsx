'use client';

import {
  Plus as AddIcon,
  ArrowLeftToLine,
  ArrowRightToLine,
  X as CloseIcon,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  type ChangeEvent,
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

export function SidebarContent({ prompts }: SidebarContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const formRef = useRef<HTMLFormElement | null>(null);

  const [searchState, searchAction, isPending] = useActionState(
    searchPromptAction,
    { success: true, prompts }
  );

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  const hasQuery = query.trim().length > 0;
  const promptList = hasQuery ? (searchState.prompts ?? prompts) : prompts;

  function collapseSidebar() {
    setIsCollapsed(true);
  }

  function expandSidebar() {
    setIsCollapsed(false);
  }

  function handleNewPrompt() {
    router.push('/new');
  }

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    const newQuery = event.target.value;
    setQuery(newQuery);

    startTransition(() => {
      const url = newQuery ? `/?q=${encodeURIComponent(newQuery)}` : '/';
      router.push(url, { scroll: false });
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
              size="icon"
              className="hidden rounded-lg transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-500 md:inline-flex"
              onClick={expandSidebar}
            >
              <ArrowRightToLine className="h-5 w-5 text-gray-100" />
            </Button>
          </header>
          <div className="flex flex-column items-center justify-center space-y-4">
            <Button
              onClick={handleNewPrompt}
              aria-label="Novo prompt"
              title="Novo Prompt"
            >
              <AddIcon className="h-5 w-5 text-white" />
            </Button>
          </div>
        </section>
      )}

      {!isCollapsed && (
        <>
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

            <section className="mb-5">
              <form
                ref={formRef}
                action={searchAction}
                className="group relative w-full"
              >
                <Input
                  name="q"
                  type="text"
                  placeholder="Buscar prompts..."
                  onChange={handleQueryChange}
                  autoFocus
                  value={query}
                />
                {isPending && (
                  <div
                    title="Carregando prompts"
                    className="-translate-y-1/2 absolute top-1/2 right-2 flex items-center gap-2 text-gray-300"
                  >
                    <Spinner aria-label="Carregando prompts" />
                  </div>
                )}
              </form>
            </section>

            <div>
              <Button onClick={handleNewPrompt} className="w-full" size="lg">
                <AddIcon className="mr-2 h-5 w-5" />
                Novo prompt
              </Button>
            </div>
          </section>
          <nav
            className="flex-1 overflow-auto px-6 pb-6"
            aria-label="Lista de prompts"
          >
            <PromptList prompts={promptList} />
          </nav>
        </>
      )}
    </aside>
  );
}
