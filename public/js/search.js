
$(document).ready(function() {

  
  $('#liveSearch').on('keyup', function() {
    const query = $(this).val().trim();

    
    if (query.length < 2) {
      $('#searchResults').html('');
      $('#opportunityCards').show();
      return;
    }

    
    $.ajax({
      url: '/opportunities/search',
      method: 'GET',
      data: { q: query },
      success: function(results) {
        if (results.length === 0) {
          $('#searchResults').html('<p class="text-muted p-3">No results found</p>');
          $('#opportunityCards').hide();
          return;
        }

        
        let html = '';
        results.forEach(function(opp) {
          html += `
            <div class="search-item">
              <strong>${opp.title}</strong>
              <span class="text-muted small ms-2">${opp.domain}</span>
              ${opp.hasStipend ? '<span class="badge bg-success ms-2">Stipend</span>' : ''}
            </div>
          `;
        });

        $('#searchResults').html(html);
        $('#opportunityCards').hide();
      }
    });
  });

  
  $('#liveSearch').on('blur', function() {
    if ($(this).val().trim() === '') {
      setTimeout(function() {
        $('#searchResults').html('');
        $('#opportunityCards').show();
      }, 200);
    }
  });

});


function applyFilters() {
  const search = $('#liveSearch').val();
  const domain = $('#domainFilter').val();
  const hasStipend = $('#stipendFilter').val();

  let url = '/opportunities?';
  if (search) url += `search=${search}&`;
  if (domain) url += `domain=${domain}&`;
  if (hasStipend) url += `hasStipend=${hasStipend}`;

  window.location.href = url;
}
