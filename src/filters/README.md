# Filter module

`src/filters` is the canonical home for task filter parsing, validation,
evaluation, and shared filter types.

- Import public filter APIs and types from `src/filters`.
- `parser.ts` owns parsing, validation, serialization, and the builder API.
- `evaluator.ts` applies parsed expressions to tasks for client-side filtering.
- `types.ts` defines the shared parser, storage, and execution contracts.

The former `src/utils/filters.ts`, `src/types/filters.ts`, and task evaluator
paths remain as compatibility re-exports. New production code should not import
from those paths.
