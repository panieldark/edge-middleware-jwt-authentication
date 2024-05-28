const { execSync } = require("child_process");

function getCommitDate(sha) {
  try {
    const result = execSync(`git show -s --format=%ci ${sha}`, {
      encoding: "utf-8"
    }).trim();
    return new Date(result);
  } catch (error) {
    console.error(`Error fetching commit date for SHA ${sha}:`, error);
    return null; // Return null to indicate failure
  }
}

function shouldBuild() {
  const previousSha = process.env.VERCEL_GIT_PREVIOUS_SHA;
  if (!previousSha) {
    console.log("No previous SHA found. Proceeding with build.");
    process.exit(1);
  }

  const lastBuildDate = getCommitDate(previousSha);
  if (!lastBuildDate) {
    console.log("Failed to retrieve last build date. Proceeding with build.");
    process.exit(1);
  }

  const now = new Date();
  const hoursSinceLastBuild = (now - lastBuildDate) / (1000 * 60 * 60);
  if (hoursSinceLastBuild >= 24) {
    console.log("More than 24 hours since last build. Proceeding with build.");
    process.exit(1);
  } else {
    console.log("Less than 24 hours since last build. Skipping build.");
    process.exit(0);
  }
}

shouldBuild();
