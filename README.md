# CareerTrix

## What is CareerTrix?
- Personalized career development platform
- Analyzes user skills vs desired job requirements
- Generates a custom learning roadmap using Markmap
![Image](https://github.com/user-attachments/assets/24d87704-d9da-422a-9939-9a470e94f4b7)

## Website Live Link
  - [View Website](careertrix.onrender.com)

## Features
- **Resume Analysis**
  - Upload resume or input skills on first login
  - Backend extracts and stores user skills

- **Skill Gap Identification**
  - Compares current skills with dream job requirements

- **Personalized Roadmaps**
  - Creates tailored roadmaps
  - Uses Markmap structure from Markdown

- **Job Postings Integration**
  - Fetches near by job posting using Hacker News API

## User Flow
1. New user signs up
2. Upload resume or input skills
3. Skills are stored in backend
4. User specifies dream job role
5. System compares and generates roadmap (Markmap)
6. Job postings for that role shown via API

## Tech Stack
- **Frontend**: HTML
- **Backend**: Django
- **Database**: PostgreSQL
- **Visualization**: Markmap (Node module)

## Contributing
1. Fork the repository
2. Create a new branch
```bash
git checkout -b feature/YourFeature
```
3. Commit changes
```bash
git commit -m "Your message"
```
4. Push branch
```bash 
git push origin feature/YourFeature
```
5. Open Pull Request
