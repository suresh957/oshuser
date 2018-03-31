angular.module('newapp')
  .controller('serviceMgmtCtrl', function($scope, $http, $location, $window, resturl) {
	$scope.options = [
		{ name: 'All', status: 'ALL' },
		{ name: 'Opened', status: 'N' },
		{ name: 'Closed', status: 'Y' }];
	
	// Default API Response Calling //
	var payload = {
		status : "ALL"
	};
	$http.post(resturl+"/admin/getServicesBooking?pageNumber=1&pageSize=15", payload).then(function(resp){
		console.log(resp);
		$scope.serviceBookedData = resp.data.responseData;
		$scope.bookingCount = resp.data.paginationData.totalCount;
	});
	
	$scope.getBookedService = function(bookedService){
		console.log(bookedService);
		$scope.bookedDetails = {
			"servicesBookingId" : bookedService.servicesBookingId,
			"serviceType" : bookedService.serviceType,
			"bookingDate" : bookedService.bookingDate,
			// Customer Details //
			"customerName" :bookedService.customerBookingdetails.customerName,
			"contactNumber" :bookedService.customerBookingdetails.contactNumber,
			"street" :bookedService.customerBookingdetails.street,
			"area" :bookedService.customerBookingdetails.area,
			"city" :bookedService.customerBookingdetails.city,
			"state" :bookedService.customerBookingdetails.state,
			"pinCode" :bookedService.customerBookingdetails.pinCode,
			"emailAddress" :bookedService.customerBookingdetails.emailAddress,
			
			// Service Provider Details //
			"companyName" :bookedService.serviceProviderDetails.companyName,
			"telephoneNumber" :bookedService.serviceProviderDetails.contactNumber,
			"houseNumber" :bookedService.serviceProviderDetails.houseNumber,
			"serviceStreet" :bookedService.serviceProviderDetails.street,
			"serviceArea" :bookedService.serviceProviderDetails.area,
			"serviceCity" :bookedService.serviceProviderDetails.city,
			"serviceState" :bookedService.serviceProviderDetails.state,
			"servicePincode" :bookedService.serviceProviderDetails.pinCode,
			"providerEmail" :bookedService.serviceProviderDetails.emailAddress,
		};
		$scope.showCloseBtn = false;
		if(bookedService.status == "N"){
			$scope.showCloseBtn = true;
		}
		
	}
	$scope.bookServicePaging = function(page, pageSize, total){
		var payload = {
			status: "ALL"
		};
		$http.post(resturl+"/admin/getServicesBooking/?pageNumber="+page+"&pageSize=15", payload).then(function(resp){
			$scope.serviceBookedData = resp.data.responseData;
			$scope.bookingCount = resp.data.paginationData.totalCount;
		});
	}
	
	// Entries Filtering Based on Service State //
	$scope.selectToFilter = function (selectedValue) {
		console.log(selectedValue);
		if(selectedValue.status == "N") {
			$scope.statusValue = selectedValue.status;
			var payload = {
				status : "N"
			}
			console.log(status);
			$http.post(resturl+"/admin/getServicesBooking?pageNumber=1&pageSize=15",payload).then(function(resp) {
				$scope.serviceBookedData = resp.data.responseData;
				$scope.bookingCount = resp.data.paginationData.totalCount;
			});
			$scope.bookServicePaging = function (page, pageSize, total) {
				$http.post(resturl+"/admin/getServicesBooking?pageNumber="+page+"&pageSize=15",payload).then(function(resp) {
					$scope.serviceBookedData = resp.data.responseData;
					$scope.bookingCount = resp.data.paginationData.totalCount;
				});
			};	
		}
		else if(selectedValue.status == "Y"){
			$scope.statusValue = selectedValue.status;
			var payload = {
				status : "Y"
			}
			console.log(status);
			$http.post(resturl+"/admin/getServicesBooking?pageNumber=1&pageSize=15",payload).then(function(resp) {
				$scope.serviceBookedData = resp.data.responseData;
				$scope.bookingCount = resp.data.paginationData.totalCount;
			});
			$scope.bookServicePaging = function (page, pageSize, total) {
				$http.post(resturl+"/admin/getServicesBooking?pageNumber="+page+"&pageSize=15", payload).then(function(resp) {
					$scope.serviceBookedData = resp.data.responseData;
					$scope.bookingCount = resp.data.paginationData.totalCount;
				});
			};
		}
		else {
			$scope.statusValue = "ALL";
			var payload = {
				status : "ALL"
			}
			console.log(status);
			$http.post(resturl+"/admin/getServicesBooking?pageNumber=1&pageSize=15",payload).then(function(resp) {
				$scope.serviceBookedData = resp.data.responseData;
				$scope.bookingCount = resp.data.paginationData.totalCount;
			});
			$scope.bookServicePaging = function (page, pageSize, total) {
				$http.post(resturl+"/admin/getServicesBooking/?pageNumber="+page+"&pageSize=15",payload).then(function(resp) {
					$scope.serviceBookedData = resp.data.responseData;
					$scope.bookingCount = resp.data.paginationData.totalCount;
				});
			};
		}
	}
	// Closing A Booked Service //
	$scope.closeBookedServ = function(bookedDetails){
		$('.bookServicePopup').modal('hide');
		console.log(bookedDetails);
		var reqPayload = {
			servicesBookingId : bookedDetails.servicesBookingId,
			status : "Y",
			comment : bookedDetails.comment
		};
		console.log(reqPayload);
		$http.post(resturl+"/admin/servicesBooking", reqPayload).then(function(resp){
			console.log(resp);
			if(resp.data.status == "TRUE"){
				$('.successPopup').modal('show');
				$scope.success = resp.data.successMessage;
			}
			else{
				$('.ErrdealModal').modal('show');
				$scope.failure = resp.data.errormessage;
			}
			var reqObj = {
				status : "ALL"
			}
			console.log(reqObj);
			$http.post(resturl+"/admin/getServicesBooking?pageNumber=1&pageSize=15", reqObj).then(function(resp){
				console.log(resp);
				$scope.serviceBookedData = resp.data.responseData;
				$scope.bookingCount = resp.data.paginationData.totalCount;
			});
		});
	}
	
	// Confirmation to Delete A Booked Service //
	$scope.deleteBookService = function(){
		$('.bookServicePopup').modal('hide');
		$('.confirmPopup').modal('show');
	}
	
	// Deletion of Booked Service //
	$scope.confirmDelete = function(servicesBookingId){
		$('.confirmPopup').modal('hide');
		$http.get(resturl+"/admin/deleteServicesBooking/"+servicesBookingId).then(function(resp){
			console.log(resp);
			if(resp.data.status == "TRUE"){
				$('.successPopup').modal('show');
				$scope.success = resp.data.successMessage;
			}
			else{
				$('.ErrdealModal').modal('show');
				$scope.failure = resp.data.errormessage;
			}
			var reqObj = {
				status : "ALL"
			}
			console.log(reqObj);
			$http.post(resturl+"/admin/getServicesBooking?pageNumber=1&pageSize=15", reqObj).then(function(resp){
				console.log(resp);
				$scope.serviceBookedData = resp.data.responseData;
				$scope.bookingCount = resp.data.paginationData.totalCount;
			});
		});
	}
	
});