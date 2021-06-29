/* eslint-disable import/prefer-default-export */
import { toast } from 'react-toastify';
import queryString from 'query-string';
import {
  setAdminCustomerList, setNewAdminCustomer,
  updateExistCustomer, setAdminCustomerDetail,
  setCustomerSideDetail,
  setAdminCustomerDeal,
  getCustomerNotesSuccess,
  getCustomerNotesFailure,
  gettingCustomerNotes
} from '../redux/actions';
import makeTheApiCall, { generateOptions } from './apiCalls';

export const getCustomers = (limit, page, search) => {
  let url = `customers?limit=${limit}&page=${page}`;
  if (search) {
    url += search;
  }
  const options = generateOptions(url, 'GET');
  return (dispatch) => (
    makeTheApiCall(options)
      .then((response) => {
        dispatch(setAdminCustomerList(response.data));
        return response.data;
      }).catch((error) => {
        throw error;
      })
  );
};

export const createCustomer = (data, index) => {
  const options = generateOptions('customers', 'POST', data);
  return (dispatch) => (
    makeTheApiCall(options)
      .then((response) => {
        toast.success('Customer Added successfully.');
        dispatch(setNewAdminCustomer(response.data, index));
        return response.data;
      }).catch((error) => {
        if (error.status === 202) {
          toast.success('Customer Added successfully.');
        } else {
          const keys = Object.keys(error.response.data.errors);
          keys.forEach((key) => {
            error.response.data.errors[key].forEach((err) => {
              toast.error(err);
            });
          });
        }
        throw error;
      })
  );
};

export const updateCustomer = (id, data) => {
  const options = generateOptions(`customers/${id}`, 'PUT', data);
  return (dispatch) => (
    makeTheApiCall(options)
      .then((response) => {
        toast.success('Customer updated successfully.');
        dispatch(updateExistCustomer({ ...data }));
        return response.data;
      }).catch((error) => {
        if (error.status === 202) {
          toast.success('Customer updated successfully.');
          dispatch(updateExistCustomer({ ...data }));
        } else {
          const keys = Object.keys(error.response.data.errors);
          keys.forEach((key) => {
            error.response.data.errors[key].forEach((err) => {
              toast.error(err);
            });
          });
        }
        throw error;
      })
  );
};

export const getCustomersProductDetails = (
  id, status, durationType, duration, page, search
) => {
  const options = generateOptions(
   `customers/${id}/products?status=${status}&durationType=${durationType}&duration=${duration}&page=${page}&limit=10&search=${search}`, 'GET'
  );
  return (dispatch) => makeTheApiCall(options)
    .then((response) => {
      dispatch(setAdminCustomerDetail(response.data));
      return response.data;
    }).catch((error) => {
      throw error;
    });
};

export const getCustomersDealMode = (
  id, durationType, duration, page, search
) => {
  const params = {
    durationType,
    duration,
    page,
    search,
    limit: 10
  };
  const options = generateOptions(`deal-mode/customers/${id}/deals`, 'GET', params);
  return (dispatch) => makeTheApiCall(options)
    .then((response) => {
      dispatch(setAdminCustomerDetail(response.data));
      return response.data;
    }).catch((error) => {
      throw error;
    });
};

export const getCustomerOverview = (id) => {
  const options = generateOptions(`customers/${id}/overview`, 'GET');
  return (dispatch) => makeTheApiCall(options)
    .then((response) => {
      dispatch(setCustomerSideDetail(response.data));
      return response.data;
    }).catch((error) => {
      throw error;
    });
};

export const getCustomerNotes = (filters) => {
  const allFilters = {
    limit: 100,
    page: 1,
    order: 'ASC',
    ...filters
  };
  const options = generateOptions(`customers/note?${queryString.stringify(allFilters)}`);
  return (dispatch) => {
    dispatch(gettingCustomerNotes());
    return makeTheApiCall(options).then(({ data }) => {
      dispatch(getCustomerNotesSuccess(data));
      return data;
    }).catch((error) => {
      dispatch(getCustomerNotesFailure());
      throw error;
    });
  };
};

export const getDealById = (id) => {
  const options = generateOptions(`deal-mode/deal/${id}`, 'GET');
  return (dispatch) => makeTheApiCall(options)
    .then((response) => {
      dispatch(setAdminCustomerDeal(response.data));
      return response.data;
    }).catch((error) => {
      throw error;
    });
};

export const createDocumentForDeal = (id, type, quoteId) => {
  const options = generateOptions(`deal-mode/deal/elements/${id}/create`, 'POST', {
    type,
    quoteId
  });
  return () => makeTheApiCall(options)
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};

export const uploadDocumentForDeal = (id, file) => {
  const formData = new FormData();
  formData.append('document', file);
  const options = generateOptions(
    `deal-mode/deal/elements/${id}/upload`, 'POST', formData, 'multipart/form-data'
  );
  return () => makeTheApiCall(options)
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};

export const updateDealState = (id, state) => {
  const options = generateOptions(`deal-mode/deal/${id}`, 'PUT', { state });
  return () => makeTheApiCall(options)
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
};

// export const getAllCustomers = (page, search) => {
//   const options = generateOptions(
//    `customers/all?limit=10&page=${page}&search=${search}`, 'GET');
//   return (dispatch) =>
//   // dispatch(gettingClientDetails());
//     makeTheApiCall(options)
//       .then((response) => {
//         console.log('getAllCustomers', response.data);
//         // dispatch(getClientSuccess(response.data));
//         return response.data;
//       }).catch((error) => {
//         // dispatch(getClientFailure());
//         throw error;
//       });
// };
