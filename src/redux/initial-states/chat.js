const chatInitialState = {
  customers: {
    assigned: [],
    unassigned: [],
    loading: false
  },
  chatMessages: {
    loading: false,
    data: [],
    posting: false,
  },
  team: {
    data: [],
    loading: false,
  },
  groupDetails: {
    loading: false,
    members: [],
    group: {}
  },
  totalUnreadCounts: 0
};

export default chatInitialState;
