# Design skill verification

Initial phase: no skill was installed. Update after the author supplied the specific redesign URL: the original `redesign-existing-projects` skill has now been manually installed and read, as detailed below. No installer, hook, global config, plugin, MCP server, runtime dependency or Tier C skill was executed/added.

The required provenance entry point https://open-design.ai/plugins/codex-design/ returned HTTP 403. Direct Tier A page requests also failed in this environment. Upstream installation/license checks could therefore not be completed under section 2B.1. The document explicitly permits continuing without skills that fail verification (2B.5.4); the audit here is our own code/browser audit.

| Tier A skill                | Status        | Scope / license / verification                              |
| --------------------------- | ------------- | ----------------------------------------------------------- |
| redesign-existing-projects  | Not installed | Required page inaccessible; upstream/install not verified   |
| impeccable                  | Not installed | Required page inaccessible; no project hooks approved       |
| design-system-tokens        | Not installed | Upstream unverified                                         |
| make-interfaces-feel-better | Not installed | Upstream unverified                                         |
| animation-review            | Not installed | Upstream unverified                                         |
| hallmark-design-skill       | Not installed | Upstream unverified                                         |
| visual-plan                 | Not installed | Upstream unverified; own textual wireframe supplied instead |

At the initial phase no skill directory was created. The later manual installation is documented below; automatic discovery remains unverified.

## Verified redesign skill update

- Requested page: https://open-design.ai/ko/skills/redesign-existing-projects/ (direct request failed in this environment; its current page body was not retrieved).
- Upstream: https://github.com/Leonxlnx/taste-skill . Its current README says the standalone skill was merged into design-taste-frontend. That broader skill was **not** installed.
- Original standalone source: https://github.com/Leonxlnx/taste-skill/blob/e04409a461022e1b9d0e898eac6b9224e2b9dc4e/skills/redesign-skill/SKILL.md . README installation section and MIT license were read at the same revision.
- Version pinned: e04409a461022e1b9d0e898eac6b9224e2b9dc4e. Scope: project-local `.agents/skills/redesign-existing-projects/`. Manual copy of SKILL.md and LICENSE only, using the upstream README's documented copy option. No installer, hook, executable script, network asset or global config was run.
- Skill files are excluded through local `.git/info/exclude`; they are not committed. Existing skill folders were not overwritten. No Tier C skill was installed.
- Verification: source frontmatter declares `name: redesign-existing-projects`; full text read and applied in this task. Read-only rule check: retain stack; diagnose before changes; focus on typography, spacing, states and recovery; test existing behavior. Automatic `/skills` discovery after restart was not verified; this task uses the explicitly read instructions.
- Conflicts overridden: suggestions to invent names/numbers, randomize dates, add stock imagery, global smooth/inertial scroll or replace the brand conflict with the research-preservation request. None was applied.

See redesign/AUDIT.md for the scan, diagnosis and exact changes.

## Skills CLI installation and production authorization

On 2026-11-02 the author explicitly requested the Skills CLI command and main deployment. `skills` 1.7.4 exists on npm (modified 2026-10-19). The requested current-main source returned: `No matching skills found for: redesign-existing-projects`; it offered only design-taste-frontend. No different skill was installed.

The original skill was recovered from upstream e04409a461022e1b9d0e898eac6b9224e2b9dc4e and installed with the same CLI:

```sh
npx skills add /tmp/iir-redesign-cli-source/skills/redesign-skill --skill redesign-existing-projects --agent codex --yes --copy
npx skills list --agent codex --json
```

The local input is a `git archive` of that exact upstream revision's skill folder, with its MIT license. CLI output confirmed installation and listing for Codex at `/workspace/Research/.agents/skills/redesign-existing-projects`, scope project. Installed SKILL.md SHA-256: a75d547d04595fe97a5d377dddf145d029d51487a4f2a0a5a9d3b532ca3b84cd, matching the previously read original. Existing app-local manual files were kept. The root skill files and generated skills-lock.json are locally excluded from Git. No restart claim is made; instructions are applied directly in the current task.

The adapted and applied prompt is IMPLEMENTATION_PROMPT.md. It corrects the supplied dashboard/Tailwind assumptions to the actual research site and records preservation and validation gates. The author's explicit main/deployment request supersedes REQUEST.md's earlier review-only workflow. The crawler window is not renewed.
