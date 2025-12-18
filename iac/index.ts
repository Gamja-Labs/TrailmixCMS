import * as docker_build from "@pulumi/docker-build";
import * as pulumi from "@pulumi/pulumi";
import * as random from "@pulumi/random";
import * as cloudflare from "@pulumi/cloudflare";

const config = {
    cloudflare: new pulumi.Config('cloudflare'),
    accountId: new pulumi.Config(),
    trailmixcms: new pulumi.Config('trailmixcms'),
    docs: new pulumi.Config('trailmixcms-docs'),
}

const stackName = pulumi.getStack();
const appName = config.trailmixcms.require("name");

export const buildId = new random.RandomUuid("buildId", {
    keepers: {
        timestamp: new Date().toISOString(),
    }
});

const cloudflareApiToken = config.cloudflare.requireSecret("apiToken");
const cloudflareAccountId = config.accountId.require("accountId");

const pagesProjectName = `${appName}-${stackName}-pages-project`;
const pagesProject = new cloudflare.PagesProject(pagesProjectName, {
    accountId: cloudflareAccountId,
    name: `${appName}-${stackName}`,
    productionBranch: "main",
});

export const pagesProjectSubdomain = pulumi.interpolate`${pagesProject.subdomain}`;

const enableDns = config.trailmixcms.get("enableDns") === 'true';
if (enableDns) {
    const cloudflareZoneId = config.trailmixcms.require("cloudflareZoneid");

    const cloudflareZoneName = `${appName}-${stackName}-zone`;
    const cloudflareZone = cloudflare.Zone.get(cloudflareZoneName, cloudflareZoneId);

    const zoneDomain = cloudflareZone.name;
    const dnsRecordName = `${appName}-${stackName}-record`;
    const record = new cloudflare.DnsRecord(dnsRecordName, {
        zoneId: cloudflareZone.id,
        name: 'docs',
        content: pagesProjectSubdomain,
        type: "CNAME",
        ttl: 1,
        proxied: true,
        comment: `Created by Pulumi for ${appName}-${stackName}`,
    });

    const pagesDomainName = `${appName}-${stackName}-pages-domain`;
    const pagesDomain = new cloudflare.PagesDomain(pagesDomainName, {
        accountId: cloudflareAccountId,
        name: pulumi.interpolate`docs.${zoneDomain}`,
        projectName: pagesProject.name,
    });
}

const webDeploymentImageName = `${appName}-${stackName}-web-deployment`;

// Build args for Docker build
const dockerBuildArgs: Record<string, pulumi.Input<string>> = {
    VITE_BUILD_ID: buildId.result,
    CLOUDFLARE_API_TOKEN: cloudflareApiToken,
    CLOUDFLARE_ACCOUNT_ID: cloudflareAccountId,
    CLOUDFLARE_PROJECT_NAME: pagesProject.name,
};

const webDeploymentImage = new docker_build.Image(
    webDeploymentImageName,
    {
        context: {
            location: "../",
        },
        dockerfile: {
            location: `../docs/dockerfile`,
        },
        buildArgs: dockerBuildArgs,
        push: false,
        buildOnPreview: false,
        exports: [
            {
                cacheonly: {}
            }
        ],

    },
    {
        dependsOn: [
            pagesProject,
            // backendApp,
        ]
    }
);