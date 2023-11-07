document.addEventListener('DOMContentLoaded', function() {
    const timelineData = [
        {
            date: 'Aug 2021 - Present',
            title: 'Software Engineer',
            description: 'Kaha/Fenergo'
        },
        {
            date: 'Mar 2020 - Aug 2021',
            title: 'Analyst Developer',
            description: 'Capitec Bank'
        },
        {
            date: 'October 2018 - Mar 2020',
            title: 'Software Developer',
            description: 'Haefele Software'
        }
        ,
        {
            date: 'Sep 2014 - Sep 2018',
            title: 'Systems Analyst / Software Developer',
            description: 'Shearwater Adventures'
        }
    ];
    
        const timeline = document.getElementById('timeline');
    
        timelineData.forEach((item, index) => {
            let entry = document.createElement('div');
            entry.classList.add('timeline-entry');
            entry.setAttribute('id', 'entry-' + index);
    
            let dot = document.createElement('div');
            dot.classList.add('timeline-dot');
    
            let date = document.createElement('div');
            date.textContent = item.date;
            date.classList.add('timeline-date');
    
            let content = document.createElement('div');
            content.classList.add('timeline-content');
            content.setAttribute('id', 'content-' + index);
    
            let title = document.createElement('h3');
            title.textContent = item.title;
    
            let description = document.createElement('p');
            description.textContent = item.description;
            description.style.display = 'none'; // Initially hide the description
    
            // Click event to toggle the description visibility
            entry.addEventListener('click', function() {
                description.style.display = description.style.display === 'none' ? 'block' : 'none';
            });
    
            content.appendChild(title);
            content.appendChild(description);
    
            entry.appendChild(dot);
            entry.appendChild(date);
            entry.appendChild(content);
    
            timeline.appendChild(entry);
        });
    });
    