
// Bloomfolio - Portfolio Builder 🌸

const portfolioForm = document.getElementById("portfolio-form");
const downloadButton = document.getElementById("download-button");
const statusMessage = document.getElementById("status-message");
const yearElement = document.getElementById("year");

let generatedPortfolio = "";

// Update the footer year
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// Safely escape text before placing it in generated HTML
function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// Accept only HTTP and HTTPS web links
function safeWebURL(value) {
    try {
        const url = new URL(value);

        if (url.protocol === "https:" || url.protocol === "http:") {
            return url.href;
        }
    } catch (error) {
        return "";
    }

    return "";
}

// Generate the portfolio
if (portfolioForm) {
    portfolioForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const jobTitle = document.getElementById("jobTitle").value.trim();
        const bio = document.getElementById("bio").value.trim();
        const skillsInput = document.getElementById("skills").value.trim();
        const projectName = document.getElementById("projectName").value.trim();
        const projectDescription = document.getElementById("projectDescription").value.trim();
        const email = document.getElementById("email").value.trim();
        const githubInput = document.getElementById("github").value.trim();

        if (!fullName || !jobTitle || !bio) {
            statusMessage.textContent =
                "Please fill in your name, job title, and biography.";
            return;
        }

        const skills = skillsInput
            ? skillsInput.split(",").map(function (skill) {
                return skill.trim();
            }).filter(Boolean)
            : [];

        // Update the preview
        document.getElementById("preview-avatar").textContent =
            fullName.charAt(0).toUpperCase();

        document.getElementById("preview-name").textContent = fullName;
        document.getElementById("preview-title").textContent = jobTitle;
        document.getElementById("preview-bio").textContent = bio;

        document.getElementById("preview-project").textContent =
            projectName || "My Project";

        document.getElementById("preview-project-description").textContent =
            projectDescription || "Add a description of your project.";

        // Display skills safely
        const skillsContainer = document.getElementById("preview-skills");
        skillsContainer.replaceChildren();

        if (skills.length) {
            skills.forEach(function (skill) {
                const tag = document.createElement("span");
                tag.textContent = skill;
                skillsContainer.appendChild(tag);
            });
        } else {
            skillsContainer.textContent = "No skills added yet.";
        }

        // Display email
        const emailPreview = document.getElementById("preview-email");
        emailPreview.replaceChildren();

        if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            const emailLink = document.createElement("a");
            emailLink.href = "mailto:" + email;
            emailLink.textContent = email;
            emailPreview.appendChild(emailLink);
        } else {
            emailPreview.textContent = email || "No email added.";
        }

        // Display GitHub link
        const safeGithub = safeWebURL(githubInput);
        const githubPreview = document.getElementById("preview-github");
        githubPreview.replaceChildren();

        if (safeGithub) {
            const githubLink = document.createElement("a");
            githubLink.href = safeGithub;
            githubLink.textContent = "Visit my GitHub";
            githubLink.target = "_blank";
            githubLink.rel = "noopener noreferrer";
            githubPreview.appendChild(githubLink);
        } else {
            githubPreview.textContent = githubInput
                ? "Please enter a valid URL beginning with https://"
                : "No GitHub link added.";
        }

        // Prepare the downloadable HTML
        generatedPortfolio = createPortfolioHTML({
            fullName: fullName,
            jobTitle: jobTitle,
            bio: bio,
            skills: skills,
            projectName: projectName,
            projectDescription: projectDescription,
            email: email,
            github: safeGithub
        });

        downloadButton.disabled = false;

        statusMessage.textContent =
            "Your portfolio is ready! You can now download your website. 🌸";

        document.getElementById("portfolio-preview").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
}

// Build the standalone portfolio page
function createPortfolioHTML(data) {
    const skillsHTML = data.skills.length
        ? data.skills.map(function (skill) {
            return "<span class=\"skill\">" +
                escapeHTML(skill) + "</span>";
        }).join("\n")
        : "<p>No skills added yet.</p>";

    let emailHTML = "";

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        emailHTML = "<p><a href=\"mailto:" +
            escapeHTML(data.email) + "\">" +
            escapeHTML(data.email) + "</a></p>";
    }

    let githubHTML = "";

    if (data.github) {
        githubHTML = "<p><a href=\"" +
            escapeHTML(data.github) +
            "\" target=\"_blank\" rel=\"noopener noreferrer\">" +
            "Visit my GitHub</a></p>";
    }

    const name = escapeHTML(data.fullName);
    const title = escapeHTML(data.jobTitle);
    const bio = escapeHTML(data.bio).replace(/\r?\n/g, "<br>");
    const project = escapeHTML(data.projectName || "My Project");
    const description = escapeHTML(
        data.projectDescription || "More details about my project coming soon."
    ).replace(/\r?\n/g, "<br>");

    // Build the document using ordinary string concatenation
    let html = "<!DOCTYPE html>\n";
    html += "<html lang=\"en\">\n";
    html += "<head>\n";
    html += "<meta charset=\"UTF-8\">\n";
    html += "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n";
    html += "<title>" + name + " | Portfolio</title>\n";

    html += "<style>\n";
    html += "* { box-sizing: border-box; }\n";
    html += "body { margin: 0; padding: 40px 20px; font-family: Arial, sans-serif; color: #352650; background: linear-gradient(135deg, #c9b2ff, #bba0fa, #e9ddff); line-height: 1.7; }\n";
    html += "main { max-width: 850px; margin: 0 auto; }\n";
    html += ".card { background: white; padding: 30px; margin-bottom: 22px; border-radius: 22px; box-shadow: 0 8px 25px rgba(70,40,120,0.12); }\n";
    html += ".flower { font-size: 30px; }\n";
    html += "h1, h2 { color: #7047b8; }\n";
    html += "h1 { font-size: clamp(2rem, 6vw, 3.5rem); margin-bottom: 5px; }\n";
    html += ".title { font-size: 1.25rem; color: #8a69c5; }\n";
    html += ".skill { display: inline-block; padding: 7px 14px; margin: 5px; background: #eee5ff; border-radius: 20px; }\n";
    html += "a { color: #7047b8; overflow-wrap: anywhere; }\n";
    html += "footer { text-align: center; padding: 20px; }\n";
    html += "</style>\n";
    html += "</head>\n";

    html += "<body>\n<main>\n";

    html += "<section class=\"card\">\n";
    html += "<div class=\"flower\">🌸</div>\n";
    html += "<h1>" + name + "</h1>\n";
    html += "<div class=\"title\">" + title + "</div>\n";
    html += "<p>" + bio + "</p>\n";
    html += "</section>\n";

    html += "<section class=\"card\">\n";
    html += "<h2>My Skills</h2>\n";
    html += skillsHTML + "\n";
    html += "</section>\n";

    html += "<section class=\"card\">\n";
    html += "<h2>My Project</h2>\n";
    html += "<h3>" + project + "</h3>\n";
    html += "<p>" + description + "</p>\n";
    html += "</section>\n";

    html += "<section class=\"card\">\n";
    html += "<h2>Contact Me</h2>\n";
    html += emailHTML + "\n";
    html += githubHTML + "\n";
    html += "</section>\n";

    html += "<footer>Made with Bloomfolio 🌸</footer>\n";
    html += "</main>\n</body>\n</html>";

    return html;
}

// Download the portfolio
if (downloadButton) {
    downloadButton.addEventListener("click", function () {
        if (!generatedPortfolio) {
            statusMessage.textContent =
                "Please generate your portfolio before downloading.";
            return;
        }

        const file = new Blob([generatedPortfolio], {
            type: "text/html;charset=utf-8"
        });

        const fileURL = URL.createObjectURL(file);
        const link = document.createElement("a");

        link.href = fileURL;
        link.download = "my-portfolio.html";

        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(function () {
            URL.revokeObjectURL(fileURL);
        }, 1000);

        statusMessage.textContent =
            "Your website has been downloaded! Open my-portfolio.html to view it. 💜";
    });
}

