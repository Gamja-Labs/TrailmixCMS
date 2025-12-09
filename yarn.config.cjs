// @ts-check

/** @type {import('@yarnpkg/types')} */
const { defineConfig } = require(`@yarnpkg/types`);


const excludeProjects = ['simple-todo-api', 'cms-api'];

/**
 * This rule will enforce that a workspace MUST depend on the same version of
 * a dependency as the one used by the other workspaces.
 *
 * @param {import('@yarnpkg/types').Yarn.Constraints.Context} context
 */
function enforceConsistentDependenciesAcrossTheProject({ Yarn }) {
    for (const dependency of Yarn.dependencies()) {
        // excludeProjects are a special case, they are not locked to a specific version
        if (excludeProjects.includes(dependency.workspace.ident ?? '')) {
            continue;
        }

        for (const otherDependency of Yarn.dependencies({ ident: dependency.ident })) {
            // excludeProjects are a special case, they are not locked to a specific version
            if (excludeProjects.includes(otherDependency.workspace.ident ?? '')) {
                continue;
            }
            dependency.update(otherDependency.range);
        }
    }
}

module.exports = defineConfig({
    constraints: async ctx => {
        enforceConsistentDependenciesAcrossTheProject(ctx);
    },
});