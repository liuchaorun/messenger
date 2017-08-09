/**
 * Created by 31641 on 2017-6-27.
 */
/**Error modal refreshment**/
const $error_modal = $('#error_modal');
$(function ()
{
	$error_modal.on('hidden.bs.modal', function ()
	{
		location.reload(true);
	})
});